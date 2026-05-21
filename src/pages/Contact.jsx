import { useState } from 'react'

import toast from 'react-hot-toast'

import {
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
} from 'react-icons/fa'

const Contact = () => {

  const [formData, setFormData] =
    useState({
      name: '',
      email: '',
      message: '',
    })

  const whatsappNumber =
    '916307111011'

  const phoneNumber =
    '+916307111011'

  const emailAddress =
    'anujrana54638@gmail.com'

  const messageText = `Hello GYM PRO,

Name: ${formData.name}

Email: ${formData.email}

Message: ${formData.message}`

  /* WHATSAPP */

  const handleWhatsApp = (e) => {

    e.preventDefault()

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        messageText
      )}`

    window.open(
      whatsappUrl,
      '_blank'
    )

    toast.success(
      'Opening WhatsApp...'
    )

  }

  /* GMAIL */

  const handleEmail = () => {

    const subject =
      'Gym Membership Enquiry'

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(
        messageText
      )}`

    window.open(
      gmailUrl,
      '_blank'
    )

    toast.success(
      'Opening Gmail...'
    )

  }

  /* CALL */

  const handleCall = () => {

    window.location.href =
      `tel:${phoneNumber}`

    toast.success(
      'Opening phone dialer...'
    )

  }

  return (

    <div className='min-h-screen bg-black text-white pt-10 pb-20 px-4'>

      <div className='container-custom max-w-6xl mx-auto'>

        {/* HEADING */}

        <div className='text-center mb-16'>

          <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold'>
            Contact Us
          </h1>

          <p className='text-gray-400 mt-6 max-w-2xl mx-auto'>
            Get in touch with our fitness experts and start your transformation journey today.
          </p>

        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

          {/* LEFT SIDE */}

          <div className='space-y-6'>

            {/* WHATSAPP CARD */}

            <div className='bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-8'>

              <div className='flex items-center gap-4 mb-5'>

                <div className='w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-white text-2xl'>
                  <FaWhatsapp />
                </div>

                <div>

                  <h2 className='text-2xl font-bold'>
                    WhatsApp Support
                  </h2>

                  <p className='text-gray-400 text-sm mt-1'>
                    Fastest way to contact us
                  </p>

                </div>

              </div>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  'Hello GYM PRO, I want to know about membership.'
                )}`}
                target='_blank'
                rel='noreferrer'
                className='inline-block bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-4 rounded-2xl transition duration-300'
              >
                Chat on WhatsApp
              </a>

            </div>

            {/* EMAIL + PHONE */}

            <div className='bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6'>

              {/* EMAIL */}

              <div className='flex items-center justify-between gap-4 flex-wrap'>

                <div className='flex items-center gap-4'>

                  <div className='w-14 h-14 rounded-2xl bg-yellow-500 flex items-center justify-center text-black text-xl'>
                    <FaEnvelope />
                  </div>

                  <div>

                    <h3 className='text-xl font-bold'>
                      Email
                    </h3>

                    <p className='text-gray-400 break-all'>
                      {emailAddress}
                    </p>

                  </div>

                </div>

                <button
                  type='button'
                  onClick={handleEmail}
                  className='bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-2xl font-bold transition'
                >
                  Open Gmail
                </button>

              </div>

              {/* PHONE */}

              <div className='flex items-center justify-between gap-4 flex-wrap'>

                <div className='flex items-center gap-4'>

                  <div className='w-14 h-14 rounded-2xl bg-yellow-500 flex items-center justify-center text-black text-xl'>
                    <FaPhoneAlt />
                  </div>

                  <div>

                    <h3 className='text-xl font-bold'>
                      Phone
                    </h3>

                    <p className='text-gray-400'>
                      {phoneNumber}
                    </p>

                  </div>

                </div>

                <button
                  type='button'
                  onClick={handleCall}
                  className='bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-2xl font-bold transition'
                >
                  Call Now
                </button>

              </div>

            </div>

          </div>

          {/* CONTACT FORM */}

          <form
            onSubmit={handleWhatsApp}
            className='bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-10 space-y-6'
          >

            <h2 className='text-3xl font-bold mb-2'>
              Send Message
            </h2>

            <p className='text-gray-400 mb-8'>
              Fill the form and continue on WhatsApp or Gmail.
            </p>

            <input
              type='text'
              placeholder='Your Name'
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className='w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 transition'
              required
            />

            <input
              type='email'
              placeholder='Your Email'
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className='w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 transition'
              required
            />

            <textarea
              rows='6'
              placeholder='Your Message'
              value={formData.message}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  message: e.target.value,
                })
              }
              className='w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 transition resize-none'
              required
            ></textarea>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

              <button className='bg-green-500 hover:bg-green-400 text-white py-4 rounded-2xl font-bold transition duration-300'>
                Send on WhatsApp
              </button>

              <button
                type='button'
                onClick={handleEmail}
                className='bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-2xl font-bold transition duration-300'
              >
                Open Gmail
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  )

}

export default Contact