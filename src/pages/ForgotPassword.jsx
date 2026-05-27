import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const logAxiosError = (title, error) => {
    console.log(`\n❌ ${title}`)
    console.log('FULL ERROR:', error)
    console.log('MESSAGE:', error.message)
    console.log('CODE:', error.code)
    console.log('STATUS:', error.response?.status)
    console.log('BACKEND DATA:', error.response?.data)
    console.log('HEADERS:', error.response?.headers)
    console.log('REQUEST URL:', error.config?.url)
    console.log('REQUEST METHOD:', error.config?.method)
    console.log('REQUEST DATA:', error.config?.data)
  }

  const getErrorMessage = (error) => {
    if (error.code === 'ERR_NETWORK') {
      return 'Backend server is not running or API URL is wrong'
    }

    return (
      error.response?.data?.message ||
      error.message ||
      'Failed to send reset email'
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }

    try {
      setLoading(true)

      console.log('\n🚀 FORGOT PASSWORD STARTED')
      console.log('API URL:', `${API}/api/auth/forgot-password`)
      console.log('EMAIL:', email)

      const { data } = await axios.post(
        `${API}/api/auth/forgot-password`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('✅ FORGOT PASSWORD SUCCESS:', data)

      setSent(true)

      toast.success(
        data?.message || 'Password reset email sent'
      )
    } catch (error) {
      logAxiosError('FORGOT PASSWORD ERROR', error)

      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
      console.log('🛑 FORGOT PASSWORD FINISHED')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Forgot Password
          </h1>

          <p className="text-gray-400 mt-3">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-gray-300 leading-relaxed">
              Password reset link has been sent to:
            </p>

            <p className="text-yellow-500 font-bold mt-3 break-all">
              {email}
            </p>

            <Link
              to="/login"
              className="block w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold transition"
            >
              Back To Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-yellow-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-gray-400 text-center">
              Remember password?{' '}
              <Link
                to="/login"
                className="text-yellow-500 hover:text-yellow-400 font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword