import {
  useEffect,
  useState,
} from 'react'

import axios from 'axios'
import { motion } from 'framer-motion'

import {
  dummyTestimonials,
} from '../data/dummyWebsiteData'

const API = import.meta.env.VITE_API_URL

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/public/testimonials`
      )

      setTestimonials(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (error) {
      console.log(error)

      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  const displayTestimonials =
    testimonials.length > 0
      ? testimonials
      : dummyTestimonials

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

          <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-sm mb-4">
            Client Reviews
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white">
            Testimonials
          </h2>

          <p className="text-gray-400 mt-4 md:mt-6 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Hear what our members say about their fitness transformation journey.
          </p>

        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {displayTestimonials.map((item, index) => (

            <motion.div
              key={item._id || index}
              initial={{
                opacity: 0,
                y: 70,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
              }}
              viewport={{
                once: true,
              }}
              className="relative h-full"
            >

              <div className="h-full bg-zinc-900 border border-white/10 rounded-[2rem] p-6 md:p-8 hover:border-yellow-500/70 transition duration-500 hover:-translate-y-2">

                <div className="flex items-center justify-between mb-8">

                  <div className="flex items-center gap-4">

                    <img
                      src={
                        item.image ||
                        'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                      }
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500"
                    />

                    <div>

                      <h3 className="text-lg md:text-xl font-bold text-white">
                        {item.name}
                      </h3>

                      <p className="text-gray-400 text-sm">
                        {item.role || 'Gym Member'}
                      </p>

                    </div>

                  </div>

                  <div className="text-5xl text-yellow-500/20 font-serif">
                    ”
                  </div>

                </div>

                <div className="flex items-center gap-1 mb-6">

                  {[...Array(Math.min(item.rating || 5, 5))].map((_, i) => (

                    <span
                      key={i}
                      className="text-yellow-500 text-lg"
                    >
                      ★
                    </span>

                  ))}

                </div>

                <p className="text-gray-300 leading-relaxed text-sm md:text-base min-h-[120px]">
                  “{item.message || item.review}”
                </p>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">

                  <span className="text-gray-500 text-sm">
                    Verified Member
                  </span>

                  <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                    {item.rating || 5}.0
                  </span>

                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  )
}

export default Testimonials