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

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post(
        `${API}/api/auth/login`,
        formData,
        config
      )

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
      toast.error(
        error.response?.data?.message || 'Login Failed'
      )
    } finally {
      setLoading(false)
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
            <label className="block text-sm text-gray-400 mb-2">
              Password
            </label>

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