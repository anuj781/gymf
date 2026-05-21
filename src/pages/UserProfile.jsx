import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { FaComments, FaEnvelope } from 'react-icons/fa'

const API = `${import.meta.env.VITE_API_URL}/api/private-chat`

const UserProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }

  useEffect(() => {
    fetchProfile()
  }, [id])

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(
        `${API}/profile/${id}`,
        config
      )

      setProfile(data)
    } catch (error) {
      console.log(error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  const startChat = async () => {
    try {
      const { data } = await axios.post(
        `${API}/conversation/${id}`,
        {},
        config
      )

      navigate(`/chat/${data._id}`)
    } catch (error) {
      console.log(error.response?.data || error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Profile...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        User not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-white/10 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={
              profile.profileImage ||
              profile.image ||
              'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            }
            alt={profile.name}
            className="w-40 h-40 rounded-full object-cover border-4 border-yellow-500"
          />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold">
              {profile.name}
            </h1>

            <p className="text-gray-400 mt-3 flex items-center justify-center md:justify-start gap-2">
              <FaEnvelope />
              {profile.email}
            </p>

            <p className="text-gray-300 mt-5 leading-relaxed">
              {profile.bio || 'This user has not added a bio yet.'}
            </p>

            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
                {profile.membership || 'Basic'} Member
              </span>

              <span className="bg-white/10 px-4 py-2 rounded-full">
                {profile.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <button
              onClick={startChat}
              className="mt-8 inline-flex items-center gap-3 bg-yellow-500 text-black px-8 py-4 rounded-2xl font-bold hover:bg-yellow-400"
            >
              <FaComments />
              Start Private Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile