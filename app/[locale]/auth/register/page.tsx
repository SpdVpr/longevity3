import { Metadata } from 'next';
import RegisterForm from '@/app/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account | Longevity',
  description: 'Create a new Longevity account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          Longevity
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
