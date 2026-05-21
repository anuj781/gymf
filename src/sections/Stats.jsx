import { useEffect, useState } from 'react'

import axios from 'axios'

import { motion } from 'framer-motion'

import {
  dummyPrograms,
  dummyTrainers,
} from '../data/dummyWebsiteData'

const API = import.meta.env.VITE_API_URL

const Stats = () => {
  const [stats, setStats] = useState([
    {
      number: '0+',
      title: 'Active Members',
    },
    {
      number: '0+',
      title: 'Professional Trainers',
    },
    {
      number: '0+',
      title: 'Years Experience',
    },
    {
      number: '0+',
      title: 'Fitness Programs',
    },
  ])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/public/stats`
      )

      setStats([
        {
          number: `${data?.users || 0}+`,
          title: 'Active Members',
        },
        {
          number: `${data?.trainers || dummyTrainers.length}+`,
          title: 'Professional Trainers',
        },
        {
          number: `${data?.experience || 0}+`,
          title: 'Years Experience',
        },
        {
          number: `${data?.programs || dummyPrograms.length}+`,
          title: 'Fitness Programs',
        },
      ])
    } catch (error) {
      console.log(error)

      setStats([
        {
          number: '0+',
          title: 'Active Members',
        },
        {
          number: `${dummyTrainers.length}+`,
          title: 'Professional Trainers',
        },
        {
          number: '0+',
          title: 'Years Experience',
        },
        {
          number: `${dummyPrograms.length}+`,
          title: 'Fitness Programs',
        },
      ])
    }
  }

  return (
    <section className='py-20 bg-zinc-950 overflow-hidden'>
      <div className='container-custom'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
              }}
              viewport={{
                once: true,
              }}
              className='bg-zinc-900 border border-white/10 rounded-2xl px-4 py-7 md:px-6 md:py-9 text-center hover:border-yellow-500 transition duration-300 hover:-translate-y-1'
            >
              <h2 className='text-3xl md:text-5xl font-extrabold text-yellow-500'>
                {item.number}
              </h2>

              <p className='mt-3 text-gray-400 text-xs md:text-base font-medium leading-relaxed'>
                {item.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats