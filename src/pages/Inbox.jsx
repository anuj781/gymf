import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaInbox, FaTrash } from 'react-icons/fa'

const API = `${import.meta.env.VITE_API_URL}/api/private-chat`

const Inbox = () => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  const userInfo = JSON.parse(
    localStorage.getItem('userInfo')
  )

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }

  useEffect(() => {
    fetchInbox()
  }, [])

  const fetchInbox = async () => {
    try {
      const { data } = await axios.get(
        `${API}/conversations`,
        config
      )

      setConversations(
        Array.isArray(data) ? data : []
      )
    } catch (error) {
      console.log(
        error.response?.data || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  const deleteChat = async (
    e,
    conversationId
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (
      !confirm(
        'Are you sure you want to delete this chat permanently?'
      )
    ) {
      return
    }

    try {
      await axios.delete(
        `${API}/conversation/${conversationId}`,
        config
      )

      setConversations((prev) =>
        prev.filter(
          (chat) => chat._id !== conversationId
        )
      )
    } catch (error) {
      console.log(
        error.response?.data || error.message
      )
    }
  }

  const getOtherUser = (members) => {
    return members.find(
      (member) => member._id !== userInfo?._id
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Inbox...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 flex items-center gap-4">
          <FaInbox className="text-yellow-500" />
          Inbox
        </h1>

        <div className="space-y-4">
          {conversations.map((conversation) => {
            const otherUser = getOtherUser(
              conversation.members
            )

            return (
              <Link
                key={conversation._id}
                to={`/chat/${conversation._id}`}
                className="block bg-zinc-900 border border-white/10 hover:border-yellow-500 rounded-3xl p-5 transition"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={
                        otherUser?.profileImage ||
                        otherUser?.image ||
                        'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                      }
                      alt={otherUser?.name}
                      className="w-16 h-16 rounded-full object-cover border border-yellow-500"
                    />

                    <div className="min-w-0">
                      <h2 className="text-xl font-bold truncate">
                        {otherUser?.name}
                      </h2>

                      <p className="text-gray-400 text-sm mt-1 truncate">
                        {conversation.lastMessage ||
                          'No messages yet'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) =>
                      deleteChat(
                        e,
                        conversation._id
                      )
                    }
                    className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-xl transition"
                    title="Delete Chat"
                  >
                    <FaTrash />
                  </button>
                </div>
              </Link>
            )
          })}
        </div>

        {conversations.length === 0 && (
          <p className="text-gray-500 text-center mt-20">
            No private chats yet.
          </p>
        )}
      </div>
    </div>
  )
}

export default Inbox