import {
  useEffect,
  useState,
} from 'react'

import axios from 'axios'

import {
  motion,
} from 'framer-motion'

import {
  useNavigate,
} from 'react-router-dom'

import toast from 'react-hot-toast'

import {
  FaDumbbell,
  FaRunning,
  FaHeartbeat,
} from 'react-icons/fa'

import {
  dummyPrograms,
} from '../data/dummyWebsiteData'

const API = import.meta.env.VITE_API_URL

const Programs = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectingProgram, setSelectingProgram] = useState(null)

  const navigate = useNavigate()

  const userInfo = JSON.parse(
    localStorage.getItem('userInfo')
  )

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/public/programs`
      )

      setPrograms(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (error) {
      console.log(error)

      setPrograms([])
    } finally {
      setLoading(false)
    }
  }

  const selectProgram = async (program) => {
    if (!userInfo?.token) {
      toast.error('Please login first')

      navigate('/login')

      return
    }

    if (!program?._id) {
      toast.error(
        'This demo program cannot be selected'
      )

      return
    }

    try {
      setSelectingProgram(program._id)

      const { data } = await axios.put(
        `${API}/api/users/select-program/${program._id}`,
        {},
        config
      )

      if (data?.user) {
        localStorage.setItem(
          'userInfo',
          JSON.stringify({
            ...userInfo,
            ...data.user,
            token: userInfo.token,
          })
        )
      }

      toast.success(
        'Program selected successfully'
      )

      navigate('/dashboard')
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      )

      toast.error(
        error.response?.data?.message ||
          'Program selection failed'
      )
    } finally {
      setSelectingProgram(null)
    }
  }

  const displayPrograms =
    programs.length > 0
      ? programs
      : dummyPrograms

  const getIcon = (category) => {
    switch (category) {
      case 'Strength':
        return <FaDumbbell />

      case 'Cardio':
        return <FaRunning />

      case 'Yoga':
      case 'Flexibility':
        return <FaHeartbeat />

      default:
        return <FaDumbbell />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl md:text-3xl font-bold">
        Loading...
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-black text-white pt-24 md:pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          viewport={{
            once: true,
          }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Our Programs
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Premium fitness programs designed to transform your strength,
            stamina and lifestyle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 lg:gap-8">

          {displayPrograms.map((program, index) => (

            <motion.div
              key={program._id || index}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              viewport={{
                once: true,
              }}
              className="group bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-500/80 transition-all duration-300 hover:-translate-y-2 flex flex-col shadow-xl shadow-black/30"
            >

              <div className="relative h-72 sm:h-80 md:h-72 lg:h-80 overflow-hidden">

                <img
                  src={
                    program.image ||
                    'https://cdn-icons-png.flaticon.com/512/2966/2966480.png'
                  }
                  alt={program.title || 'Program'}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>

                <div className="absolute top-5 left-5 bg-yellow-500 text-black text-xs font-extrabold px-4 py-2 rounded-full">
                  {program.category || 'Custom'}
                </div>

                <div className="absolute bottom-5 left-5 w-14 h-14 rounded-2xl bg-yellow-500 text-black flex items-center justify-center text-2xl shadow-lg">
                  {getIcon(program.category)}
                </div>

              </div>

              <div className="p-6 flex flex-col flex-1">

                <div className="mb-5">

                  <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1">
                    {program.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-6 line-clamp-3">
                    {program.description ||
                      'A complete fitness program designed to help you reach your goals faster.'}
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">

                  <div className="bg-black/40 border border-white/10 rounded-2xl px-4 py-4">
                    <p className="text-gray-400 text-xs mb-1">
                      Duration
                    </p>

                    <p className="text-white text-sm font-semibold">
                      {program.durationWeeks
                        ? `${program.durationWeeks} weeks`
                        : program.duration || '4 weeks'}
                    </p>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-2xl px-4 py-4">
                    <p className="text-gray-400 text-xs mb-1">
                      Level
                    </p>

                    <p className="text-white text-sm font-semibold">
                      {program.level || 'Beginner'}
                    </p>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-2xl px-4 py-4">
                    <p className="text-gray-400 text-xs mb-1">
                      Category
                    </p>

                    <p className="text-white text-sm font-semibold line-clamp-1">
                      {program.category || 'Custom'}
                    </p>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-2xl px-4 py-4">
                    <p className="text-gray-400 text-xs mb-1">
                      Price
                    </p>

                    <p className="text-yellow-500 text-sm font-bold">
                      ₹{program.price || 0}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => selectProgram(program)}
                  disabled={selectingProgram === program._id}
                  className="mt-auto w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-extrabold py-4 rounded-2xl transition duration-300"
                >
                  {selectingProgram === program._id
                    ? 'Joining...'
                    : 'Join Program'}
                </button>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  )
}

export default Programs