import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'

import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-zinc-950 border-t border-white/10 py-12 md:py-16 overflow-hidden'>
      <div className='container-custom'>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>

          <div>
            <h2 className='text-3xl font-extrabold text-yellow-500'>
              GYM PRO
            </h2>

            <p className='text-gray-400 mt-6 leading-relaxed text-sm sm:text-base'>
              Premium fitness experience designed for modern athletes and fitness lovers.
            </p>
          </div>

          <div>
            <h3 className='text-2xl font-bold mb-6'>
              Quick Links
            </h3>

            <ul className='space-y-4 text-gray-400 text-sm sm:text-base'>

              <li>
                <Link
                  to='/'
                  className='hover:text-yellow-500 transition'
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to='/about'
                  className='hover:text-yellow-500 transition'
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to='/pricing'
                  className='hover:text-yellow-500 transition'
                >
                  Pricing
                </Link>
              </li>

              <li>
                <Link
                  to='/contact'
                  className='hover:text-yellow-500 transition'
                >
                  Contact
                </Link>
              </li>

            </ul>
          </div>

          <div>
            <h3 className='text-2xl font-bold mb-6'>
              Programs
            </h3>

            <ul className='space-y-4 text-gray-400 text-sm sm:text-base'>
              <li>Strength Training</li>
              <li>Cardio Program</li>
              <li>Fitness & Yoga</li>
              <li>Personal Coaching</li>
            </ul>
          </div>

          <div>
            <h3 className='text-2xl font-bold mb-6'>
              Follow Us
            </h3>

            <div className='flex items-center gap-4 text-xl sm:text-2xl'>

              <a
                href='#'
                className='w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition duration-300'
              >
                <FaFacebookF />
              </a>

              <a
                href='#'
                className='w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition duration-300'
              >
                <FaInstagram />
              </a>

              <a
                href='#'
                className='w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition duration-300'
              >
                <FaTwitter />
              </a>

              <a
                href='#'
                className='w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition duration-300'
              >
                <FaYoutube />
              </a>

            </div>
          </div>

        </div>

        <div className='border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm sm:text-base'>
          © 2026 GYM PRO. All Rights Reserved.
        </div>

      </div>
    </footer>
  )
}

export default Footer