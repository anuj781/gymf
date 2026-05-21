import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaUser, FaComments } from 'react-icons/fa'

const API = `${import.meta.env.VITE_API_URL}/api/private-chat`

const SearchUsers = () => {
  const navigate = useNavigate()

  const [keyword, setKeyword] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const userInfo = useMemo(() => {
    return JSON.parse(localStorage.getItem('userInfo'))
  }, [])

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${userInfo?.token}`,
      },
    }
  }, [userInfo?.token])

  useEffect(() => {
    if (!userInfo?.token) return

    const timer = setTimeout(() => {
      fetchUsers()
    }, 500)

    return () => clearTimeout(timer)
  }, [keyword, userInfo?.token])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      const { data } = await axios.get(
        `${API}/users/search?keyword=${keyword}`,
        config
      )

      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.log(error.response?.data || error.message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const startChat = async (receiverId) => {
    try {
      const { data } = await axios.post(
        `${API}/conversation/${receiverId}`,
        {},
        config
      )

      navigate(`/chat/${data._id}`)
    } catch (error) {
      console.log(error.response?.data || error.message)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find People
        </h1>

        <p className="text-gray-400 mb-8">
          Search users, visit profiles and start private chat.
        </p>

        <div className="relative mb-10">
          <FaSearch className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-yellow-500"
          />
        </div>

        {loading && (
          <p className="text-yellow-500 mb-6">
            Searching...
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-5 flex items-center gap-4"
            >
              <img
                src={
                  user.profileImage ||
                  user.image ||
                  'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                }
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border border-yellow-500"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  {user.name}
                </h2>

                <p className="text-gray-400 text-sm">
                  {user.email}
                </p>

                <div className="flex gap-3 mt-4">
                  <Link
                    to={`/profile/${user._id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm"
                  >
                    <FaUser />
                    Profile
                  </Link>

                  <button
                    onClick={() => startChat(user._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500 text-black font-bold text-sm hover:bg-yellow-400"
                  >
                    <FaComments />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && users.length === 0 && (
          <p className="text-gray-500 text-center mt-16">
            No users found.
          </p>
        )}
      </div>
    </div>
  )
}

export default SearchUsers