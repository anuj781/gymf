import { useState } from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  motion,
  AnimatePresence,
} from 'framer-motion'

import {
  HiMenuAlt3,
  HiX,
} from 'react-icons/hi'

import {
  FaSearch,
  FaInbox,
  FaComments,
} from 'react-icons/fa'

import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = useNavigate()

  const { user, logout } = useAuth()

  const logoutHandler = () => {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
    {
      name: 'Public Chat',
      path: '/chat',
      icon: <FaComments />,
    },
  ]

  const privateLinks = [
    {
      name: 'Find People',
      path: '/search-users',
      icon: <FaSearch />,
    },
    {
      name: 'Inbox',
      path: '/inbox',
      icon: <FaInbox />,
    },
  ]

  const defaultImage =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png'

  return (
    <nav className='fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10'>
      <div className='container-custom'>

        <div className='flex items-center justify-between min-h-20 gap-4'>

          <Link
            to='/'
            onClick={closeMenu}
            className='shrink-0 text-2xl md:text-3xl font-extrabold tracking-widest text-yellow-500'
          >
            GYM PRO
          </Link>

          <div className='hidden xl:flex items-center gap-5 flex-1 justify-center'>
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className='flex items-center gap-2 text-white hover:text-yellow-500 transition duration-300 font-medium whitespace-nowrap'
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {user &&
              privateLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className='flex items-center gap-2 text-white hover:text-yellow-500 transition duration-300 font-medium whitespace-nowrap'
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
          </div>

          <div className='hidden md:flex items-center gap-3 shrink-0'>

            {user ? (
              <>
                <div className='hidden lg:flex xl:hidden items-center gap-4'>
                  <Link
                    to='/search-users'
                    className='flex items-center gap-2 text-white hover:text-yellow-500 transition font-medium whitespace-nowrap'
                  >
                    <FaSearch />
                    Find
                  </Link>

                  <Link
                    to='/inbox'
                    className='flex items-center gap-2 text-white hover:text-yellow-500 transition font-medium whitespace-nowrap'
                  >
                    <FaInbox />
                    Inbox
                  </Link>
                </div>

                {user.isAdmin && (
                  <Link
                    to='/admin'
                    className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-full font-bold transition whitespace-nowrap'
                  >
                    Admin
                  </Link>
                )}

                <Link
                  to='/dashboard'
                  className='flex items-center gap-3 bg-zinc-900 border border-white/10 px-3 py-2 rounded-full hover:border-yellow-500 transition max-w-[210px]'
                >
                  <img
                    key={user.profileImage}
                    src={
                      user.profileImage ||
                      user.image ||
                      defaultImage
                    }
                    alt='profile'
                    className='w-10 h-10 rounded-full object-cover border border-yellow-500 shrink-0'
                  />

                  <div className='hidden xl:block min-w-0'>
                    <p className='text-xs text-gray-400'>
                      Welcome
                    </p>

                    <h3 className='font-bold text-white max-w-[110px] truncate'>
                      {user.name}
                    </h3>
                  </div>
                </Link>

                <button
                  onClick={logoutHandler}
                  className='bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-full font-bold transition whitespace-nowrap'
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to='/signup'
                className='bg-yellow-500 text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition duration-300 whitespace-nowrap'
              >
                Join Now
              </Link>
            )}

          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className='md:hidden text-3xl text-white'
            aria-label='Toggle menu'
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>

        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.25,
            }}
            className='md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 max-h-[calc(100vh-80px)] overflow-y-auto'
          >
            <div className='flex flex-col items-center gap-6 py-8 px-4'>

              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={closeMenu}
                  className='flex items-center gap-3 text-lg hover:text-yellow-500 transition'
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              {user &&
                privateLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    onClick={closeMenu}
                    className='flex items-center gap-3 text-lg hover:text-yellow-500 transition'
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}

              {user ? (
                <div className='flex flex-col items-center gap-5 w-full'>

                  <Link
                    to='/dashboard'
                    onClick={closeMenu}
                    className='flex flex-col items-center'
                  >
                    <img
                      key={user.profileImage}
                      src={
                        user.profileImage ||
                        user.image ||
                        defaultImage
                      }
                      alt='profile'
                      className='w-20 h-20 rounded-full object-cover border-2 border-yellow-500'
                    />

                    <h3 className='mt-3 text-xl font-bold max-w-[240px] truncate'>
                      {user.name}
                    </h3>
                  </Link>

                  {user.isAdmin && (
                    <Link
                      to='/admin'
                      onClick={closeMenu}
                      className='bg-purple-600 text-white px-8 py-3 rounded-full font-bold'
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={logoutHandler}
                    className='bg-red-500 text-white px-8 py-3 rounded-full font-bold'
                  >
                    Logout
                  </button>

                </div>
              ) : (
                <Link
                  to='/signup'
                  onClick={closeMenu}
                  className='bg-yellow-500 text-black px-8 py-3 rounded-full font-bold'
                >
                  Join Now
                </Link>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar