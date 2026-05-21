import Hero from '../sections/Hero'
import Programs from '../sections/Programs'
import Stats from '../sections/Stats'
import Trainers from '../sections/Trainers'
import PricingSection from '../sections/PricingSection'
import Testimonials from '../sections/Testimonials'
import Footer from '../sections/Footer'

const Home = () => {

  return (
    <div className='w-full overflow-x-hidden bg-black text-white'>

      <Hero />

      <div className='space-y-0'>

        <Programs />

        <Stats />

        <Trainers />

        <PricingSection />

        <Testimonials />

      </div>

      <Footer />

    </div>
  )
}

export default Home