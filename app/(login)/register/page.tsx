import SchoolLogo from '@/app/ui/utils/school-logo'
import RegisterForm from '@/app/ui/register/form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bridge School Register'
}

export default function RegisterPage() {
  return (
    <main className='flex items-center justify-center md:h-screen'>
      <div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32'>
        <div className='mb-2 flex h-20 items-center justify-center rounded-md bg-blue-600 p-2 md:h-40'>
          <SchoolLogo />
        </div>
        <RegisterForm />
      </div>
    </main>
  )
}
