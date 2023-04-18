import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { trpc } from '../trpc';
import { TextInput, Textarea, Button } from '@mantine/core';

interface IFormInputs {
  title: string;
  content: string;
}

export function PostForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInputs>();
  const addPost = trpc.post.create.useMutation();
  const utils = trpc.useContext();
  const titleRef = useRef<HTMLInputElement>(null);

  const onSubmit = (data: IFormInputs) => {
    console.log(data);
    addPost.mutate(data, {
      onSuccess: () => {
        utils.post.get.invalidate();
        setValue('title', '');
        setValue('content', '');
        titleRef.current?.focus();
      },
    });
  };

  useEffect(() => {
    register('title', { required: true });
    register('content', { required: true, maxLength: 250 });
  }, [register]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        placeholder='Title'
        label='Your title'
        {...register('title', { required: true, maxLength: 50 })}
        size='lg'
        autoFocus
      />
      {errors.title?.type === 'maxLength' && (
        <p className='bg-red-600 text-white'>Max length is 50 characters</p>
      )}
      <Textarea
        placeholder='Post'
        label='Your post'
        {...register('content', { required: true, maxLength: 250 })}
        size='lg'
      />
      {errors.content?.type === 'maxLength' && (
        <p className='bg-red-600 text-white'>Max length is 250 characters</p>
      )}

      <Button variant='filled' size='lg' my={12} type='submit'>
        Post
      </Button>
    </form>
  );
}
