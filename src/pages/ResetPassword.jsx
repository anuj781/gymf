import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const getErrorMessage = (error) => {
    if (error.code === 'ERR_NETWORK') {
      return 'Backend server is not running or API URL is wrong'
    }

    return (
      error.response?.data?.message ||
      error.message ||
      'Password reset failed'
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { data } = await axios.put(
        `${API}/api/auth/reset-password/${token}`,
        { password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      setResetSuccess(true)

      toast.success(data?.message || 'Password reset successfully')

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-10 text-center">
          <h1 className="text-3xl font-bold text-white">
            Password Reset Successful
          </h1>

          <p className="text-gray-400 mt-4">
            Redirecting to login...
          </p>

          <Link
            to="/login"
            className="block w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold transition"
          >
            Go To Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Reset Password
          </h1>

          <p className="text-gray-400 mt-3">
            Create a new password for your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-yellow-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-yellow-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold transition disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword