import { RegisterForm } from '../components/RegisterForm';
import { Wrapper } from '../components/Wrapper';

export function RegisterPage() {
  return (
      <Wrapper>
      <h1 className="text-5xl font-bold text-center py-5">Register</h1>
      <RegisterForm />
    </Wrapper>
  );
}
