import {
  useEffect,
  useState,
} from 'react'

import axios from 'axios'

import {
  motion,
} from 'framer-motion'

import {
  Link,
} from 'react-router-dom'

import {
  dummyPricing,
} from '../data/dummyWebsiteData'

const API = import.meta.env.VITE_API_URL

const PricingSection = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPricingPlans()
  }, [])

  const fetchPricingPlans = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/public/pricing`
      )

      setPlans(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (error) {
      console.log(error)
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  const displayPlans =
    plans.length > 0
      ? plans
      : dummyPricing

  return (
    <section className='py-16 md:py-24 bg-zinc-950 overflow-hidden'>
      <div className='container-custom'>
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
          className='text-center mb-14 md:mb-20'
        >
          <h2 className='text-3xl sm:text-4xl md:text-6xl font-bold'>
            Membership Plans
          </h2>

          <p className='text-gray-400 mt-4 md:mt-6 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed'>
            Choose the perfect membership plan according to your fitness goals.
          </p>
        </motion.div>

        {loading ? (
          <div className='text-center text-white text-2xl font-bold'>
            Loading...
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
            {displayPlans.map((plan, index) => (
              <motion.div
                key={plan._id || index}
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
                className={`relative bg-black border rounded-3xl p-6 md:p-10 transition duration-500 hover:-translate-y-2 ${
                  plan.isPopular
                    ? 'border-yellow-500'
                    : 'border-white/10 hover:border-yellow-500'
                }`}
              >
                {plan.isPopular && (
                  <span className='absolute top-5 right-5 bg-yellow-500 text-black text-xs font-bold px-4 py-1 rounded-full'>
                    Popular
                  </span>
                )}

                <h3 className='text-2xl md:text-3xl font-bold mb-6'>
                  {plan.title}
                </h3>

                <h2 className='text-5xl md:text-6xl font-extrabold text-yellow-500 mb-3 break-words'>
                  ₹{plan.finalPrice || plan.price}
                </h2>

                <p className='text-gray-400 mb-8'>
                  {plan.durationInDays || 30} Days
                </p>

                {plan.discountPercentage > 0 && (
                  <p className='text-green-400 mb-6 font-semibold'>
                    {plan.discountPercentage}% OFF
                  </p>
                )}

                <ul className='space-y-4 mb-10'>
                  {(plan.features || []).map(
                    (feature, i) => (
                      <li
                        key={i}
                        className='text-gray-300 text-sm sm:text-base flex items-center gap-3'
                      >
                        <span className='text-yellow-500'>
                          ✓
                        </span>

                        {feature}
                      </li>
                    )
                  )}
                </ul>

                <Link
                  to='/pricing'
                  className='block w-full bg-yellow-500 text-black py-4 rounded-full font-bold hover:scale-105 text-center transition duration-300'
                >
                  Choose Plan
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PricingSection