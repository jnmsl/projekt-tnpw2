import { LoginForm } from '../components/LoginForm';
import { Wrapper } from '../components/Wrapper';

export function LoginPage() {
  return (
      <Wrapper>
      <h1 className="text-5xl font-bold text-center py-5">Login</h1>
      <LoginForm />
    </Wrapper>
  );
}
