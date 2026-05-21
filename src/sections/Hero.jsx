import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className='relative min-h-[80vh] flex items-center justify-center overflow-hidden px-4'>

      {/* VIDEO BACKGROUND */}

      <video
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        className='absolute inset-0 w-full h-full object-cover'
      >
        <source src='/gym.mp4' type='video/mp4' />
      </video>

      {/* DARK OVERLAY */}

      <div className='absolute inset-0 bg-black/75'></div>

      {/* GRADIENT OVERLAY */}

      <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black'></div>

      {/* CONTENT */}

      <div className='relative z-10 w-full max-w-7xl mx-auto text-center px-2 sm:px-4'>

        {/* HEADING */}

        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className='text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold uppercase leading-tight tracking-wide'
        >
          Transform Your

          <span className='text-yellow-500 block mt-2'>
            Body & Mind
          </span>

        </motion.h1>

        {/* DESCRIPTION */}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className='mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2'
        >
          Premium fitness experience with world class trainers,
          modern equipment, and award-winning gym environment.
        </motion.p>

        {/* BUTTONS */}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-10'
        >

          {/* START TRAINING BUTTON */}

          <Link
            to='/pricing'
            className='w-full sm:w-auto bg-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-400 hover:scale-105 active:scale-95 transition duration-300 text-center shadow-2xl'
          >
            Start Training
          </Link>

          {/* EXPLORE MORE BUTTON */}

          <Link
            to='/about'
            className='w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 hover:scale-105 active:scale-95 transition duration-300 text-center shadow-2xl'
          >
            Explore More
          </Link>

        </motion.div>

      </div>

    </section>
  )
}

export default Hero