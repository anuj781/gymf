import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

import {
  useNavigate,
  Link,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

const Login = () => {
  const navigate = useNavigate()
  const { updateUser } = useAuth()

  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [showResend, setShowResend] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    const userInfo = JSON.parse(
      localStorage.getItem('userInfo')
    )

    if (userInfo?._id) {
      if (userInfo.isAdmin) {
        navigate('/admin', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const getErrorMessage = (error, fallback) => {
    if (error.code === 'ERR_NETWORK') {
      return 'Backend server is not running or API URL is wrong'
    }

    return (
      error.response?.data?.message ||
      error.message ||
      fallback
    )
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setShowResend(false)

    try {
      console.log('\n🚀 LOGIN STARTED')
      console.log('API URL:', `${API}/api/auth/login`)
      console.log('FORM DATA:', {
        email: formData.email,
        password: '********',
      })

      const { data } = await axios.post(
        `${API}/api/auth/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('✅ LOGIN SUCCESS:', data)

      localStorage.setItem(
        'userInfo',
        JSON.stringify(data)
      )

      updateUser(data)

      toast.success('Login Successful')

      if (data.isAdmin) {
        navigate('/admin', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      logAxiosError('LOGIN ERROR', error)

      const message = getErrorMessage(
        error,
        'Login Failed'
      )

      toast.error(message)

      if (error.response?.data?.emailNotVerified) {
        setShowResend(true)
      }
    } finally {
      setLoading(false)
      console.log('🛑 LOGIN FINISHED')
    }
  }

  const resendVerificationEmail = async () => {
    if (!formData.email) {
      toast.error('Please enter your email first')
      return
    }

    try {
      setResending(true)

      console.log('\n📩 RESEND VERIFICATION STARTED')
      console.log('API URL:', `${API}/api/auth/resend-verification`)
      console.log('EMAIL:', formData.email)

      const { data } = await axios.post(
        `${API}/api/auth/resend-verification`,
        {
          email: formData.email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('✅ RESEND VERIFICATION SUCCESS:', data)

      toast.success(
        data?.message ||
          'Verification email sent successfully'
      )
    } catch (error) {
      logAxiosError(
        'RESEND VERIFICATION ERROR',
        error
      )

      toast.error(
        getErrorMessage(
          error,
          'Failed to resend verification email'
        )
      )
    } finally {
      setResending(false)
      console.log('🛑 RESEND VERIFICATION FINISHED')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Welcome Back
          </h2>

          <p className="text-gray-400 mt-4">
            Login to continue your fitness journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-yellow-500 transition"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-gray-400">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-yellow-500 hover:text-yellow-400 font-semibold"
              >
                Forgot Password?
              </Link>
            </div>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-yellow-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-2xl font-bold transition duration-300 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        {showResend && (
          <button
            type="button"
            onClick={resendVerificationEmail}
            disabled={resending}
            className="w-full mt-5 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold transition disabled:opacity-50"
          >
            {resending
              ? 'Sending Verification Email...'
              : 'Resend Verification Email'}
          </button>
        )}

        <p className="text-gray-400 text-center mt-8">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="text-yellow-500 hover:text-yellow-400 font-semibold"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login