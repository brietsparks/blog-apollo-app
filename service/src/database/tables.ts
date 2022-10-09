import { Table } from './table-util';

export const usersTable = new Table('users', {
  id: 'id',
  name: 'name',
  creationTimestamp: 'creation_timestamp',
});

export const postsTable = new Table('posts', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  ownerId: 'owner_id',
  title: 'title',
  body: 'body',
});

export const imagesTable = new Table('images', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  ownerId: 'owner_id',
  url: 'url',
  caption: 'caption',
});

export const tagsTable = new Table('tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  name: 'name',
});

export const postTagsTable = new Table('post_tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  postId: 'post_id',
  tagId: 'tag_id',
});

export const imageTagsTable = new Table('image_tags', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  imageId: 'image_id',
  tagId: 'tag_id',
});