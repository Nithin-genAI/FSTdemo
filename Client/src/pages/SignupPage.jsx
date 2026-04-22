import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthForm from '../components/auth/AuthForm.jsx'

const signupFields = [
  {
    name: 'fullName',
    label: 'Full name',
    type: 'text',
    placeholder: 'Enter your full name',
    required: true,
  },
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
    placeholder: 'Create a secure password',
    required: true,
    hint: 'Use at least 8 characters for a stronger password.',
  },
]

function SignupPage() {
  const navigate = useNavigate()
  const [signupPayload, setSignupPayload] = useState(null)
  const [otp, setOtp] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (payload) => {
    setIsLoading(true)
    setStatusMessage('')

    try {
      const response = await fetch('http://localhost:5001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      setSignupPayload(payload)
      setStatusMessage('OTP sent to your email. Enter it below to verify.')
    } catch (error) {
      setStatusMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async (event) => {
    event.preventDefault()

    if (!signupPayload) {
      setStatusMessage('Please submit signup details first.')
      return
    }

    setIsLoading(true)
    setStatusMessage('')

    try {
      const response = await fetch('http://localhost:5001/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupPayload.email,
          otp,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed')
      }

      navigate('/home')
    } catch (error) {
      setStatusMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AuthForm
        title="Create your Curio account"
        description="Begin with a polished signup experience and verify your account through OTP."
        fields={signupFields}
        submitLabel={isLoading ? 'Processing...' : 'Sign up and send OTP'}
        helperText="Complete signup first, then verify the OTP sent to your email."
        altActionText="Already have an account?"
        altActionLabel="Log in"
        altActionTo="/login"
        onSubmit={handleSignup}
      />

      <form className="otp-panel" onSubmit={verifyOtp}>
        <label htmlFor="otpValue">Enter OTP</label>
        <input
          id="otpValue"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          placeholder="6-digit OTP"
          required
        />
        <button className="secondary-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      {statusMessage ? <p className="form-footer">{statusMessage}</p> : null}
    </>
  )
}

export default SignupPage
