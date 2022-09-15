import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories, Tag } from '../repositories';
import * as schema from '../graphql';

import { adaptCursorPagination } from './adapters';
import { RequestContext } from './context';

export function makeTagsResolver(repositories: Repositories) {
  const createTag: IFieldResolver<unknown, RequestContext, schema.MutationCreateTagArgs> = async (_, { params }) => {
    const creation = await repositories.tagsRepository.createTag(params, { commit: true });
    return repositories.tagsRepository.getTag(creation.id);
  }

  const getTag: IFieldResolver<unknown, RequestContext, schema.QueryGetTagArgs> = (_, { id }) => {
    return repositories.tagsRepository.getTag(id);
  };

  // const getTags: IFieldResolver<unknown, RequestContext, schema.QueryGetTagsArgs> = (_, { params }) => {
  //   return repositories.tagsRepository.getTags({
  //     pagination: adaptCursorPagination<Tag>(params.pagination),
  //     ownerId: params.ownerId
  //   });
  // };

  return {
    Query: {
      getTag,
      // getTags,
    },
    Mutation: {
      createTag
    },
    Tag: {
      id: (t) => t.id,
      creationTimestamp: (t) => t.creationTimestamp,
      name: (t) => t.title,
    }
  }
}