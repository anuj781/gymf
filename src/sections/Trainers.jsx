import {
  useEffect,
  useState,
} from 'react'

import axios from 'axios'
import { motion } from 'framer-motion'

import {
  useNavigate,
} from 'react-router-dom'

import toast from 'react-hot-toast'

import {
  dummyTrainers,
} from '../data/dummyWebsiteData'

const API = import.meta.env.VITE_API_URL

const Trainers = () => {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectingTrainer, setSelectingTrainer] = useState(null)

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
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/public/trainers`
      )

      setTrainers(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (error) {
      console.log(error)

      setTrainers([])
    } finally {
      setLoading(false)
    }
  }

  const selectTrainer = async (trainer) => {
    if (!userInfo?.token) {
      toast.error('Please login first')

      navigate('/login')

      return
    }

    if (!trainer?._id) {
      toast.error(
        'This demo trainer cannot be selected'
      )

      return
    }

    try {
      setSelectingTrainer(trainer._id)

      const { data } = await axios.put(
        `${API}/api/users/select-trainer/${trainer._id}`,
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
        'Trainer selected successfully'
      )

      navigate('/dashboard')
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      )

      toast.error(
        error.response?.data?.message ||
          'Trainer selection failed'
      )
    } finally {
      setSelectingTrainer(null)
    }
  }

  const displayTrainers =
    trainers.length > 0
      ? trainers
      : dummyTrainers

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-4xl font-bold">
        Loading...
      </div>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-black overflow-hidden">
      <div className="container-custom">

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          viewport={{
            once: true,
          }}
          className="text-center mb-14 md:mb-20"
        >

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white">
            Expert Trainers
          </h2>

          <p className="text-gray-400 mt-4 md:mt-6 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Meet our world class fitness experts and transform your body with professional guidance.
          </p>

        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

          {displayTrainers.map((trainer, index) => (

            <motion.div
              key={trainer._id || index}
              initial={{
                opacity: 0,
                y: 80,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
              }}
              viewport={{
                once: true,
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 hover:border-yellow-500 transition duration-500"
            >

              <div className="overflow-hidden">

                <img
                  src={
                    trainer.image ||
                    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                  }
                  alt={trainer.name}
                  className="w-full h-[320px] sm:h-[420px] lg:h-[500px] object-cover group-hover:scale-110 transition duration-700"
                />

              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">

                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {trainer.name}
                </h3>

                <p className="text-yellow-500 mt-2 text-sm md:text-base font-semibold">
                  {Array.isArray(trainer.specialization)
                    ? trainer.specialization.join(', ')
                    : trainer.specialty || 'Fitness Coach'}
                </p>

                <p className="text-gray-300 mt-3 text-sm leading-relaxed line-clamp-3">
                  {trainer.bio ||
                    'Certified fitness expert helping members achieve strength, stamina and transformation goals.'}
                </p>

                <div className="flex flex-wrap gap-3 mt-4">

                  <span className="inline-block bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                    {trainer.experience || 0} Years Experience
                  </span>

                  <span className="inline-block bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {trainer.availability || 'Available'}
                  </span>

                </div>

                {trainer.monthlyFee > 0 && (

                  <div className="mt-4 inline-block bg-black/60 text-yellow-500 px-4 py-2 rounded-full text-sm font-bold">
                    ₹{trainer.monthlyFee}/month
                  </div>

                )}

                <button
                  type="button"
                  onClick={() => selectTrainer(trainer)}
                  disabled={selectingTrainer === trainer._id}
                  className="w-full mt-5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-3 rounded-2xl transition duration-300 hover:scale-105"
                >
                  {selectingTrainer === trainer._id
                    ? 'Assigning...'
                    : 'Select Trainer'}
                </button>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  )
}

export default Trainers