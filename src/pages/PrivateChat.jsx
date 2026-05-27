import {
  useEffect,
  useRef,
  useState,
} from 'react'

import axios from 'axios'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  FaPaperPlane,
  FaTrash,
} from 'react-icons/fa'

import socket from '../socket'

import {
  requestNotificationPermission,
  showMessageNotification,
} from '../utils/notify'

const API = `${import.meta.env.VITE_API_URL}/api/private-chat`

const PrivateChat = () => {
  const { conversationId } = useParams()

  const navigate = useNavigate()

  const [messages, setMessages] = useState([])

  const [text, setText] = useState('')

  const [conversation, setConversation] =
    useState(null)

  const [typing, setTyping] = useState('')

  const [loading, setLoading] = useState(true)

  const bottomRef = useRef(null)

  const userInfo = JSON.parse(
    localStorage.getItem('userInfo')
  )

  const loggedInUserId =
    userInfo?._id ||
    userInfo?.id ||
    userInfo?.userId

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }

  useEffect(() => {
    requestNotificationPermission()
    fetchChatData()

    socket.emit(
      'join_private_chat',
      conversationId
    )

    socket.on(
      'receive_private_message',
      (message) => {
        if (
          message.conversation ===
            conversationId ||
          message.conversation?._id ===
            conversationId
        ) {
          setMessages((prev) => {
            const exists = prev.some(
              (msg) => msg._id === message._id
            )

            if (exists) return prev

            return [...prev, message]
          })

          const senderId =
            message.sender?._id ||
            message.sender?.id ||
            message.sender?.userId ||
            message.sender

          const isOwnMessage =
            String(senderId) ===
            String(loggedInUserId)

          if (!isOwnMessage) {
            showMessageNotification({
              title: 'New Private Message',
              body: `${
                message.sender?.name || 'Someone'
              }: ${
                message.text || 'Image message'
              }`,
            })
          }
        }
      }
    )

    socket.on(
      'private_typing',
      (name) => {
        setTyping(name)
      }
    )

    socket.on(
      'private_stop_typing',
      () => {
        setTyping('')
      }
    )

    return () => {
      socket.off(
        'receive_private_message'
      )

      socket.off('private_typing')

      socket.off(
        'private_stop_typing'
      )
    }
  }, [conversationId, loggedInUserId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  const fetchChatData = async () => {
    try {
      const [
        conversationRes,
        messagesRes,
      ] = await Promise.all([
        axios.get(
          `${API}/conversation/${conversationId}`,
          config
        ),

        axios.get(
          `${API}/messages/${conversationId}`,
          config
        ),
      ])

      setConversation(
        conversationRes.data
      )

      setMessages(
        Array.isArray(
          messagesRes.data
        )
          ? messagesRes.data
          : []
      )
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      )
    } finally {
      setLoading(false)
    }
  }

  const receiver =
    conversation?.members?.find(
      (member) =>
        String(member._id) !==
        String(loggedInUserId)
    )

  const deleteChat = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this full chat permanently?'
      )
    ) {
      return
    }

    try {
      await axios.delete(
        `${API}/conversation/${conversationId}`,
        config
      )

      navigate('/inbox')
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      )
    }
  }

  const deletePrivateMessage =
    async (messageId) => {
      if (
        !confirm(
          'Delete this message?'
        )
      )
        return

      try {
        await axios.delete(
          `${API}/message/${messageId}`,
          config
        )

        setMessages((prev) =>
          prev.filter(
            (msg) =>
              msg._id !==
              messageId
          )
        )
      } catch (error) {
        console.log(
          error.response?.data ||
            error.message
        )

        alert(
          error.response?.data
            ?.message ||
            'Delete failed'
        )
      }
    }

  const handleTyping = (e) => {
    setText(e.target.value)

    socket.emit('private_typing', {
      conversationId,
      name: userInfo?.name,
    })

    setTimeout(() => {
      socket.emit(
        'private_stop_typing',
        conversationId
      )
    }, 1000)
  }

  const sendMessage = (e) => {
    e.preventDefault()

    if (!text.trim()) return

    if (!receiver?._id) {
      alert('Receiver not found')
      return
    }

    socket.emit(
      'send_private_message',
      {
        conversationId,

        senderId: loggedInUserId,

        receiverId: receiver._id,

        text,

        imageUrl: '',
      }
    )

    setText('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Chat...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-6 px-4">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center gap-4">
          <img
            src={
              receiver?.profileImage ||
              receiver?.image ||
              'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            }
            alt={receiver?.name}
            className="w-12 h-12 rounded-full object-cover border border-yellow-500"
          />

          <div>
            <h1 className="text-2xl font-bold">
              {receiver?.name ||
                'Private Chat'}
            </h1>

            {typing && (
              <p className="text-yellow-500 text-sm">
                {typing} is typing...
              </p>
            )}
          </div>

          <button
            onClick={deleteChat}
            className="ml-auto flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-bold transition"
          >
            <FaTrash />
            Delete Chat
          </button>
        </div>

        <div className="h-[60vh] overflow-y-auto p-5 space-y-4 bg-black">
          {messages.map((message) => {
            const senderId =
              message.sender?._id ||
              message.sender?.id ||
              message.sender
                ?.userId ||
              message.sender

            const isMe =
              String(senderId) ===
              String(
                loggedInUserId
              )

            const canDelete =
              isMe ||
              userInfo?.isAdmin ===
                true

            return (
              <div
                key={message._id}
                className={`flex ${
                  isMe
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`relative max-w-[75%] rounded-2xl px-5 py-3 ${
                    isMe
                      ? 'bg-yellow-500 text-black'
                      : 'bg-zinc-800 text-white'
                  }`}
                >
                  <p className="text-sm font-semibold mb-1 pr-8">
                    {isMe
                      ? 'You'
                      : message.sender
                          ?.name}
                  </p>

                  <p className="break-words pr-8">
                    {message.text}
                  </p>

                  {canDelete &&
                    message._id && (
                      <button
                        onClick={() =>
                          deletePrivateMessage(
                            message._id
                          )
                        }
                        className={`absolute bottom-2 right-3 text-xs opacity-70 hover:opacity-100 ${
                          isMe
                            ? 'text-black'
                            : 'text-red-400'
                        }`}
                        title="Delete message"
                      >
                        <FaTrash />
                      </button>
                    )}
                </div>
              </div>
            )
          })}

          <div ref={bottomRef}></div>
        </div>

        <form
          onSubmit={sendMessage}
          className="p-5 border-t border-white/10 flex gap-3"
        >
          <input
            value={text}
            onChange={handleTyping}
            placeholder="Type private message..."
            className="flex-1 bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
          />

          <button className="bg-yellow-500 text-black px-6 rounded-2xl font-bold hover:bg-yellow-400">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  )
}

export default PrivateChat