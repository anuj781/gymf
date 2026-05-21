const About = () => {
  return (
    <div className='min-h-screen bg-black text-white pt-10 pb-20'>

      <div className='container-custom'>

        <div className='text-center mb-16'>

          <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold'>
            About GYM PRO
          </h1>

          <p className='text-gray-400 mt-6 max-w-3xl mx-auto leading-relaxed'>
            GYM PRO is a premium fitness platform designed for athletes,
            bodybuilders, and fitness enthusiasts.
          </p>

        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>

          <img
            src='https://images.unsplash.com/photo-1517836357463-d25dfeac3438'
            alt='gym'
            className='rounded-3xl h-[350px] md:h-[500px] w-full object-cover'
          />

          <div>

            <h2 className='text-3xl md:text-5xl font-bold mb-6'>
              Train Like A Champion
            </h2>

            <p className='text-gray-400 leading-relaxed mb-6'>
              We provide premium gym facilities, expert trainers,
              modern equipment, and professional workout programs.
            </p>

            <div className='space-y-4'>

              <div className='bg-zinc-900 p-5 rounded-2xl border border-white/10'>
                Professional Trainers
              </div>

              <div className='bg-zinc-900 p-5 rounded-2xl border border-white/10'>
                Premium Equipment
              </div>

              <div className='bg-zinc-900 p-5 rounded-2xl border border-white/10'>
                Nutrition Guidance
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default About