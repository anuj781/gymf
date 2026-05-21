import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL

const PaymentButton = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'

      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)

      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    try {
      if (!API) {
        toast.error('Backend API URL missing')
        return
      }

      const loaded = await loadRazorpayScript()

      if (!loaded) {
        toast.error('Razorpay SDK failed to load')
        return
      }

      const { data } = await axios.post(
        `${API}/api/payment/create-order`,
        {
          amount: 499,
        }
      )

      if (!data.success) {
        toast.error(data.message)
        return
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Gym Website',
        description: 'Membership Payment',
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${API}/api/payment/verify`,
              response
            )

            if (verifyRes.data.success) {
              toast.success('Payment Successful')
            } else {
              toast.error('Payment Verification Failed')
            }
          } catch (error) {
            toast.error(
              error?.response?.data?.message ||
                'Payment Verification Failed'
            )
          }
        },

        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },

        theme: {
          color: '#000000',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.log(error)

      toast.error(
        error?.response?.data?.message ||
          'Payment Failed'
      )
    }
  }

  return (
    <button
      onClick={handlePayment}
      className='px-6 py-3 bg-black text-white rounded-lg'
    >
      Pay ₹499
    </button>
  )
}

export default PaymentButton