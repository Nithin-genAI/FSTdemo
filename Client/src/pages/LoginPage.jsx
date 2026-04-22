import AuthForm from '../components/auth/AuthForm.jsx'

const loginFields = [
  {
    name: 'email',
    label: 'Email address',
    type: 'email',
    placeholder: 'hello@curio.ai',
    required: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
  },
]

function LoginPage() {
  return (
    <AuthForm
      title="Welcome back to Curio"
      description="This dummy login page is ready for future backend authentication integration."
      fields={loginFields}
      submitLabel="Log in"
      helperText="The login action is intentionally non-functional for now, based on your frontend-only requirement."
      altActionText="Need a new account?"
      altActionLabel="Sign up"
      altActionTo="/signup"
      auxiliaryAction={{ label: 'Forgot password?', to: '/reset-password' }}
      onSubmit={() => {}}
    />
  )
}

export default LoginPage
