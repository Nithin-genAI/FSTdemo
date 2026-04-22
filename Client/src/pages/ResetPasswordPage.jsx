import AuthForm from '../components/auth/AuthForm.jsx'

const resetFields = [
  {
    name: 'email',
    label: 'Registered email',
    type: 'email',
    placeholder: 'hello@curio.ai',
    required: true,
  },
  {
    name: 'password',
    label: 'New password',
    type: 'password',
    placeholder: 'Enter a new password',
    required: true,
  },
  {
    name: 'verifyPassword',
    label: 'Verify password',
    type: 'password',
    placeholder: 'Re-enter your new password',
    required: true,
    hint: 'This is a dummy reset flow with a verify password field for future API hookup.',
  },
]

function ResetPasswordPage() {
  return (
    <AuthForm
      title="Reset your password"
      description="Refresh your credentials with a clean recovery flow designed for future backend verification."
      fields={resetFields}
      submitLabel="Reset password"
      helperText="This reset page is UI-only for now and does not send email or verification requests yet."
      altActionText="Remembered your password?"
      altActionLabel="Back to login"
      altActionTo="/login"
      onSubmit={() => {}}
    />
  )
}

export default ResetPasswordPage
