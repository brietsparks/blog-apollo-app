import { Knex } from 'knex';

export interface CursorPaginationParams<ColumnType extends string = string> {
  field: ColumnType;
  sortDirection: SortDirection;
  cursor?: Cursor;
  limit: number;
}

export interface CursorPaginationResult<RowType extends Record<string, unknown>> {
  items: RowType[];
  cursors: Cursors;
}

export interface Cursors<T extends Cursor = Cursor> {
  start?: T;
  end?: T;
  next?: T;
}

export interface Predicate {
  orderBy: OrderBy;
  limit: number;
  where: Where;
}

export type Cursor = Knex.Value;

export type OrderBy = [string, SortDirection];

export type SortDirection = 'asc' | 'desc';

export type Where = [string, string, Cursor];

export function makeCursorPagination<ColumnType extends string = string>(params: CursorPaginationParams<ColumnType>) {
  const orderBy: OrderBy = [params.field, params.sortDirection];
  const comparator = params.sortDirection === 'asc' ? '>=' : '<=';
  const where: Where = params.cursor ? [params.field, comparator, params.cursor] : ([1, '=', 1] as any);

  const specifiedLimit = params.limit;
  const queriedLimit = params.limit + 1; // +1 to get the next cursor

  const predicate: Predicate = {
    orderBy,
    limit: queriedLimit,
    where
  };

  function getCursors<RowType extends Record<string, unknown>>(rows: RowType[]): Cursors {
    if (rows.length === 0) {
      return {
        start: params.cursor,
        end: params.cursor,
        next: undefined,
      };
    }

    const itemCursorField = params.field as keyof RowType;

    if (rows.length <= specifiedLimit) {
      return {
        start: params.cursor,
        end: rows[rows.length - 1][itemCursorField] as Cursor,
        next: undefined
      };
    }

    if (rows.length === queriedLimit) {
      return {
        start: params.cursor,
        end: rows[specifiedLimit - 1][itemCursorField] as Cursor,
        next: rows[queriedLimit - 1][itemCursorField] as Cursor
      };
    }

    throw new Error('invalid cursor pagination state in getPage. This is probably a bug with the library');
  }

  function getRows<RowType extends Record<string, unknown>>(rows: RowType[]): RowType[] {
    if (rows.length === 0) {
      return [];
    }

    if (rows.length <= specifiedLimit) {
      return rows;
    }

    if (rows.length === queriedLimit) {
      const returnableItems = [...rows];
      returnableItems.pop();
      return returnableItems;
    }

    throw new Error('invalid cursor pagination state in getItems. This is probably a bug with the library');
  }

  function getResult<RowType extends Record<string, unknown>>(retrievedItems: RowType[]): CursorPaginationResult<RowType> {
    return {
      items: getRows(retrievedItems),
      cursors: getCursors(retrievedItems)
    }
  }

  return {
    ...predicate,
    getResult,
  };
}
















