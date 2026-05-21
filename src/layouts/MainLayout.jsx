import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const MainLayout = () => {

  return (
    <div className='min-h-screen bg-black text-white overflow-x-hidden'>

      <Navbar />

      <main className='w-full pt-24'>
        <Outlet />
      </main>

    </div>
  )
}

export default MainLayout