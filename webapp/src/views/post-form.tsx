import React, { ComponentType, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

export interface PostFormProps {
  tagsComponent: ComponentType<PostFormTagsComponentProps>;
  submit: (data: PostFormData) => void | Promise<unknown>;
  buttonLabel: string;
  pending: boolean;
}

export interface PostFormTagsComponentProps {
  value?: PostFormTag[];
  onChange?: PostFormTagsChangeHandler;
}
export type PostFormTagsChangeHandler = (tags: PostFormTag[]) => void;
export type PostFormTag = { id: string };

export interface PostFormData {
  tagIds?: string[];
  title: string
  body?: string;
}

export function PostForm(props: PostFormProps) {
  const { tagsComponent: TagsForm } = props;

  const form = useForm<PostFormData>();
  const [tags, setTags] = useState<PostFormTag[]>([]);

  const reset = () => {
    form.reset();
    setTags([]);
  };

  const handleSubmit = form.handleSubmit((data, e) => {
    e?.preventDefault();
    const promise = props.submit({
      ...data,
      tagIds: tags.map(tag => tag.id)
    });
    if (promise) {
      promise.then(reset);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          {...form.register('title')}
        />

        <TagsForm
          value={tags}
          onChange={setTags}
        />

        <TextField
          label="Body"
          {...form.register('body')}
        />

        <Button type="submit">{props.buttonLabel}</Button>
      </Stack>
    </form>
  );
}
