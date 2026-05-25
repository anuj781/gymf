import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

const VerifyEmail = () => {
  const { token } = useParams()

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    verifyEmail()
  }, [token])

  const verifyEmail = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/auth/verify-email/${token}`
      )

      setSuccess(true)
      setMessage(data?.message || 'Email verified successfully')
      toast.success(data?.message || 'Email verified successfully')
    } catch (error) {
      setSuccess(false)
      setMessage(
        error.response?.data?.message ||
          'Invalid or expired verification link'
      )
      toast.error(
        error.response?.data?.message ||
          'Email verification failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-10 text-center">
        <h1 className="text-3xl font-bold text-white">
          {loading
            ? 'Verifying Email...'
            : success
              ? 'Email Verified'
              : 'Verification Failed'}
        </h1>

        <p className="text-gray-400 mt-5 leading-relaxed">
          {loading ? 'Please wait...' : message}
        </p>

        {!loading && (
          <Link
            to="/login"
            className="block w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold transition"
          >
            Go To Login
          </Link>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail