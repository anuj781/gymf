import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { FaTrash } from 'react-icons/fa'

const socket = io(import.meta.env.VITE_API_URL)

const API = `${import.meta.env.VITE_API_URL}/api/messages`

const Chat = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [typingUser, setTypingUser] = useState('')

  const messagesEndRef = useRef(null)

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const loggedInUserId =
    userInfo?._id || userInfo?.id || userInfo?.userId

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(API, config)
      setMessages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.log(error.response?.data || error.message)
    }
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === data._id)
        if (exists) return prev
        return [...prev, data]
      })
    })

    socket.on('typing', (name) => {
      setTypingUser(name)
    })

    socket.on('stop_typing', () => {
      setTypingUser('')
    })

    return () => {
      socket.off('receive_message')
      socket.off('typing')
      socket.off('stop_typing')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim()) return
    if (!loggedInUserId) return

    try {
      const { data } = await axios.post(
        API,
        {
          text: message,
          type: 'text',
        },
        config
      )

      socket.emit('send_message', data)

      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === data._id)
        if (exists) return prev
        return [...prev, data]
      })

      socket.emit('stop_typing')
      setMessage('')
    } catch (error) {
      console.log(error.response?.data || error.message)
      alert(error.response?.data?.message || 'Message send failed')
    }
  }

  const deleteMessage = async (messageId) => {
    if (!confirm('Delete this message?')) return

    try {
      await axios.delete(`${API}/${messageId}`, config)

      setMessages((prev) =>
        prev.filter((msg) => msg._id !== messageId)
      )
    } catch (error) {
      console.log(error.response?.data || error.message)
      alert(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleTyping = (e) => {
    setMessage(e.target.value)

    if (e.target.value) {
      socket.emit('typing', userInfo?.name)
    } else {
      socket.emit('stop_typing')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-10 px-4">
      <div className="max-w-5xl mx-auto w-full">

        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Live Gym Chat
          </h1>

          <p className="text-gray-400 mt-3">
            Connect with gym members in realtime
          </p>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

          <div className="border-b border-white/10 px-5 md:px-6 py-4 md:py-5 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">
              Community Chat
            </h2>

            <div className="text-sm text-green-400">
              ● Online
            </div>
          </div>

          <div className="h-[60vh] min-h-[400px] max-h-[620px] overflow-y-auto p-4 md:p-6 space-y-5 bg-black/40 scroll-smooth">
            {messages.map((msg, index) => {
              const messageUserId =
                msg.user?._id ||
                msg.user?.id ||
                msg.user?.userId ||
                msg.user

              const isOwnMessage =
                String(messageUserId) === String(loggedInUserId)

              const canDelete =
                isOwnMessage || userInfo?.isAdmin === true

              return (
                <div
                  key={msg._id || index}
                  className={`flex items-end gap-3 ${
                    isOwnMessage ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isOwnMessage && (
                    <img
                      src={
                        msg.profileImage ||
                        msg.user?.profileImage ||
                        'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                      }
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                    />
                  )}

                  <div
                    className={`relative max-w-[85%] md:max-w-[70%] rounded-3xl px-5 py-4 border shadow-lg ${
                      isOwnMessage
                        ? 'bg-yellow-500 text-black border-yellow-500'
                        : 'bg-zinc-900 text-white border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-6 mb-2">
                      <h3 className="font-bold text-sm md:text-base truncate">
                        {msg.name || msg.user?.name || 'User'}
                      </h3>

                      <span className="text-xs opacity-70 whitespace-nowrap">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString()
                          : ''}
                      </span>
                    </div>

                    <p className="leading-relaxed break-words pr-8 text-sm md:text-base">
                      {msg.text}
                    </p>

                    {canDelete && msg._id && (
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className={`absolute bottom-3 right-3 transition ${
                          isOwnMessage
                            ? 'text-black/70 hover:text-black'
                            : 'text-red-400 hover:text-red-300'
                        }`}
                        title="Delete message"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  {isOwnMessage && (
                    <img
                      src={
                        msg.profileImage ||
                        userInfo?.profileImage ||
                        'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                      }
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover border border-yellow-500 shrink-0"
                    />
                  )}
                </div>
              )
            })}

            {typingUser && (
              <p className="text-sm text-gray-400 italic px-2">
                {typingUser} is typing...
              </p>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <div className="border-t border-white/10 p-4 md:p-5 bg-zinc-950">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={handleTyping}
                onKeyDown={(e) =>
                  e.key === 'Enter' && sendMessage()
                }
                className="flex-1 bg-black border border-white/10 rounded-2xl px-5 py-4 focus:border-yellow-500 transition outline-none text-white"
              />

              <button
                onClick={sendMessage}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-2xl transition duration-300 hover:scale-105"
              >
                Send
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Chat