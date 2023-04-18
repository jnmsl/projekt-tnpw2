import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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

const loginSchema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
});

type LoginFormFields = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const loginUser = trpc.user.login.useMutation();

  const onSubmit = async (data: LoginFormFields) => {
    try {
      await loginUser.mutateAsync(data);
      console.log('User logged in successfully.');
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('An unknown error occurred.');
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <Paper p='md' shadow='xs'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid gutter='md'>
          <Col span={12}>
            <TextInput
              label='Username'
              error={errors.username?.message}
              {...register('username')}
            />
          </Col>
          <Col span={12}>
            <PasswordInput
              label='Password'
              error={errors.password?.message}
              {...register('password')}
            />
          </Col>
          <Col span={12}>
            <Button variant='filled' size='sm' type='submit'>
              Log in
            </Button>
          </Col>
        </Grid>
      </form>
    </Paper>
  );
}
