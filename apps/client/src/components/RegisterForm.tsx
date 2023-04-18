import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '../trpc';
import {
  Paper,
  Col,
  TextInput,
  PasswordInput,
  Button,
  Grid,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .nonempty('Username is required.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(8, 'Password must be at least 8 characters.')
    .refine(
      (value) => /[A-Z]/.test(value),
      'Password must contain an uppercase character.'
    )
    .refine(
      (value) => /[a-z]/.test(value),
      'Password must contain a lowercase character.'
    )
    .refine((value) => /[0-9]/.test(value), 'Password must contain a number.')
    .refine(
      (value) => /[^A-Za-z0-9]/.test(value),
      'Password must contain a special character.'
    ),
});

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const registerUser = trpc.user.register.useMutation();

  const navigate = useNavigate();

  const onSubmit = async (formData: any) => {
    try {
      await registerUser.mutateAsync(formData);
      console.log('User registered successfully.');
      navigate('/login');
      reset();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <Paper p='md' shadow='xs'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid gutter='md'>
          <Col span={12}>
            <TextInput
              label='Username'
              error={errors.username?.message as string | undefined}
              {...register('username')}
              autoFocus
            />
          </Col>
          <Col span={12}>
            <PasswordInput
              label='Password'
              error={errors.password?.message as string | undefined}
              {...register('password')}
            />
          </Col>
          <Col span={12}>
            <Button type='submit' variant='filled' size='sm'>
              Register
            </Button>
          </Col>
        </Grid>
      </form>
    </Paper>
  );
}
