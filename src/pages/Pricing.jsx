import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { dummyPricing } from '../data/dummyWebsiteData'

const API = import.meta.env.VITE_API_URL

const Pricing = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectingPlan, setSelectingPlan] = useState(null)

  const navigate = useNavigate()

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }

  useEffect(() => {
    fetchPricingPlans()
  }, [])

  const fetchPricingPlans = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/public/pricing`
      )

      setPlans(Array.isArray(data) ? data : [])
    } catch (error) {
      console.log(error)
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')

      script.src =
        'https://checkout.razorpay.com/v1/checkout.js'

      script.onload = () => resolve(true)

      script.onerror = () => resolve(false)

      document.body.appendChild(script)
    })
  }

  const selectPlanAfterPayment = async (plan) => {
    const { data } = await axios.put(
      `${API}/api/users/select-plan/${plan._id}`,
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

    toast.success('Payment successful and plan selected')

    navigate('/dashboard')
  }

  const choosePlan = async (plan) => {
    if (!userInfo?.token) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    if (!plan?._id) {
      toast.error('This demo plan cannot be selected')
      return
    }

    try {
      setSelectingPlan(plan._id)

      const loaded = await loadRazorpayScript()

      if (!loaded) {
        toast.error('Razorpay SDK failed to load')
        setSelectingPlan(null)
        return
      }

      const planPrice = Number(
        plan.finalPrice || plan.price || 0
      )

      if (!planPrice || planPrice <= 0) {
        toast.error('Invalid plan price')
        setSelectingPlan(null)
        return
      }

      const { data } = await axios.post(
        `${API}/api/payment/create-order`,
        {
          amount: planPrice,
        }
      )

      if (!data?.success) {
        toast.error(
          data?.message || 'Order creation failed'
        )

        setSelectingPlan(null)
        return
      }

      const options = {
        key: data.key,

        amount: data.order.amount,

        currency: data.order.currency,

        name: 'Gym Website',

        description:
          plan.title ||
          plan.name ||
          'Membership Payment',

        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${API}/api/payment/verify`,
              response
            )

            if (verifyRes.data.success) {
              await selectPlanAfterPayment(plan)
            } else {
              toast.error(
                'Payment verification failed'
              )
            }
          } catch (error) {
            console.log(error)

            toast.error(
              error.response?.data?.message ||
                'Payment verification failed'
            )
          } finally {
            setSelectingPlan(null)
          }
        },

        prefill: {
          name:
            userInfo?.name || 'Test User',

          email:
            userInfo?.email ||
            'test@example.com',

          contact:
            userInfo?.phone ||
            '9999999999',
        },

        theme: {
          color: '#eab308',
        },

        modal: {
          ondismiss: function () {
            setSelectingPlan(null)

            toast.error('Payment cancelled')
          },
        },
      }

      const razorpay = new window.Razorpay(
        options
      )

      razorpay.open()
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      )

      toast.error(
        error.response?.data?.message ||
          'Payment failed'
      )

      setSelectingPlan(null)
    }
  }

  const displayPlans =
    plans.length > 0
      ? plans
      : dummyPricing

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl font-bold">
        Loading...
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-black text-white pt-10 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Membership Plans
          </h1>

          <p className="text-gray-400 mt-3 text-sm md:text-base max-w-2xl mx-auto">
            Choose the perfect membership
            plan for your fitness journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayPlans.map(
            (plan, index) => {
              const planTitle =
                plan.title ||
                plan.name ||
                'Membership Plan'

              const planPrice =
                plan.finalPrice ||
                plan.price ||
                0

              return (
                <motion.div
                  key={plan._id || index}
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
                    delay:
                      index * 0.12,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className={`relative bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col ${
                    plan.isPopular
                      ? 'border-yellow-500'
                      : 'border-white/10 hover:border-yellow-500'
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute top-3 right-3 z-10 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}

                  {plan.image && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={plan.image}
                        alt={planTitle}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      {planTitle}
                    </h2>

                    <div className="flex items-end gap-1 mb-3">
                      <span className="text-4xl font-extrabold text-yellow-500 leading-none">
                        ₹{planPrice}
                      </span>

                      <span className="text-gray-400 text-sm mb-1">
                        /
                        {plan.durationInDays ||
                          30}{' '}
                        days
                      </span>
                    </div>

                    {plan.discountPercentage >
                      0 && (
                      <p className="text-green-400 text-sm font-semibold mb-3">
                        {
                          plan.discountPercentage
                        }
                        % OFF
                      </p>
                    )}

                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {plan.description ||
                        'Perfect plan for your fitness journey with premium gym access.'}
                    </p>

                    <div className="space-y-2 mb-5 flex-1">
                      {plan.features
                        ?.slice(0, 4)
                        .map(
                          (
                            feature,
                            i
                          ) => (
                            <div
                              key={i}
                              className="flex items-center gap-2"
                            >
                              <div className="w-2 h-2 rounded-full bg-yellow-500 shrink-0"></div>

                              <p className="text-gray-300 text-sm">
                                {
                                  feature
                                }
                              </p>
                            </div>
                          )
                        )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        choosePlan(
                          plan
                        )
                      }
                      disabled={
                        selectingPlan ===
                        plan._id
                      }
                      className="mt-auto w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition duration-300"
                    >
                      {selectingPlan ===
                      plan._id
                        ? 'Processing...'
                        : `Pay ₹${planPrice}`}
                    </button>
                  </div>
                </motion.div>
              )
            }
          )}
        </div>
      </div>
    </section>
  )
}

export default Pricing