import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

const Signup = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [verificationSent, setVerificationSent] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      const { data } = await axios.post(
        `${API}/api/auth/register`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      toast.success(
        data?.message ||
          'Account created. Please verify your email.'
      )

      setRegisteredEmail(formData.email)
      setVerificationSent(true)

      setFormData({
        name: '',
        email: '',
        password: '',
      })
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Signup Failed'
      )
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async () => {
    if (!registeredEmail) {
      toast.error('Email not found')
      return
    }

    try {
      setLoading(true)

      const { data } = await axios.post(
        `${API}/api/auth/resend-verification`,
        {
          email: registeredEmail,
        }
      )

      toast.success(
        data?.message ||
          'Verification email sent again'
      )
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to resend email'
      )
    } finally {
      setLoading(false)
    }
  }

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-10 text-center">
          <h1 className="text-3xl font-bold text-white">
            Verify Your Email
          </h1>

          <p className="text-gray-400 mt-4 leading-relaxed">
            We sent a verification link to:
          </p>

          <p className="text-yellow-500 font-bold mt-3 break-all">
            {registeredEmail}
          </p>

          <p className="text-gray-400 mt-5 text-sm">
            Please open your email and click the verification link.
            After verification, you can login.
          </p>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold transition"
          >
            Go To Login
          </button>

          <button
            type="button"
            onClick={resendVerification}
            disabled={loading}
            className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Create Account
          </h1>

          <p className="text-gray-400 mt-3">
            Join the premium gym community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-yellow-500 transition"
              required
            />
          </div>

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
              className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-yellow-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-yellow-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold transition duration-300 hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Signup'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-8">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-yellow-500 hover:text-yellow-400 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup