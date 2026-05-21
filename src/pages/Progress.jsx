import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Calendar from 'react-calendar'

import 'react-calendar/dist/Calendar.css'

const API = import.meta.env.VITE_API_URL

const Progress = () => {
  const userInfo = JSON.parse(
    localStorage.getItem('userInfo')
  )

  const [goals, setGoals] = useState([])

  const [progressData, setProgressData] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [formData, setFormData] =
    useState({
      weight: '',
      caloriesBurned: '',
      workoutCompleted: '',
      waterIntake: '',
      stepsWalked: '',
    })

  useEffect(() => {
    fetchGoals()
    fetchProgress()
  }, [])

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }

  /* =====================================
     FETCH GOALS
  ===================================== */

  const fetchGoals = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/goals/${userInfo._id}`,
        config
      )

      setGoals(data)
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to fetch goals'
      )
    }
  }

  /* =====================================
     FETCH PROGRESS
  ===================================== */

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/progress/${userInfo._id}`,
        config
      )

      setProgressData(data)

      setLoading(false)
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to fetch progress'
      )

      setLoading(false)
    }
  }

  /* =====================================
     HANDLE INPUT
  ===================================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })
  }

  /* =====================================
     CREATE PROGRESS
  ===================================== */

  const handleSubmit =
    async (e) => {
      e.preventDefault()

      try {
        await axios.post(
          `${API}/api/progress`,
          {
            user: userInfo._id,
            ...formData,
            date: new Date(),
          },
          config
        )

        toast.success(
          'Progress Added'
        )

        setFormData({
          weight: '',
          caloriesBurned: '',
          workoutCompleted: '',
          waterIntake: '',
          stepsWalked: '',
        })

        fetchProgress()
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'Failed to add progress'
        )
      }
    }

  /* =====================================
     DELETE PROGRESS
  ===================================== */

  const deleteProgress =
    async (id) => {
      try {
        await axios.delete(
          `${API}/api/progress/${id}`,
          config
        )

        toast.success(
          'Progress Deleted'
        )

        fetchProgress()
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'Failed to delete progress'
        )
      }
    }

  /* =====================================
     COMPLETE GOAL
  ===================================== */

  const completeGoal =
    async (goalId) => {
      try {
        await axios.put(
          `${API}/api/goals/${goalId}`,
          {
            completed: true,
            currentProgress: 100,
          },
          config
        )

        toast.success(
          'Goal Completed'
        )

        fetchGoals()
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'Failed to update goal'
        )
      }
    }

  /* =====================================
     CALENDAR COLORS
  ===================================== */

  const completedDates =
    progressData.map((item) =>
      new Date(
        item.date
      ).toDateString()
    )

  /* =====================================
     STATS
  ===================================== */

  const completedGoals =
    goals.filter(
      (goal) => goal.completed
    ).length

  const totalGoals = goals.length

  const completionRate =
    totalGoals > 0
      ? Math.round(
          (completedGoals /
            totalGoals) *
            100
        )
      : 0

  /* =====================================
     LOADING
  ===================================== */

  if (loading) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center text-4xl font-bold'>
        Loading...
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-black text-white pt-32 pb-20 px-4'>
      <div className='max-w-7xl mx-auto'>

        <div className='mb-12'>
          <h1 className='text-5xl font-bold'>
            Your Progress
          </h1>

          <p className='text-gray-400 mt-4 text-lg'>
            Track your fitness
            streaks and daily goals
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>

          <div className='bg-zinc-900 rounded-3xl p-8 border border-white/10'>
            <h2 className='text-5xl font-bold text-yellow-500'>
              {totalGoals}
            </h2>

            <p className='text-gray-400 mt-3'>
              Total Goals
            </p>
          </div>

          <div className='bg-zinc-900 rounded-3xl p-8 border border-white/10'>
            <h2 className='text-5xl font-bold text-green-500'>
              {completedGoals}
            </h2>

            <p className='text-gray-400 mt-3'>
              Completed Goals
            </p>
          </div>

          <div className='bg-zinc-900 rounded-3xl p-8 border border-white/10'>
            <h2 className='text-5xl font-bold text-blue-500'>
              {completionRate}%
            </h2>

            <p className='text-gray-400 mt-3'>
              Completion Rate
            </p>
          </div>

        </div>

        <div className='bg-zinc-900 rounded-3xl p-8 border border-white/10 mb-12'>
          <h2 className='text-3xl font-bold mb-8'>
            Add Daily Progress
          </h2>

          <form
            onSubmit={handleSubmit}
            className='grid md:grid-cols-2 gap-6'
          >

            <input
              type='number'
              name='weight'
              placeholder='Weight (kg)'
              value={formData.weight}
              onChange={handleChange}
              className='bg-black border border-white/10 rounded-2xl px-5 py-4'
              required
            />

            <input
              type='number'
              name='caloriesBurned'
              placeholder='Calories Burned'
              value={
                formData.caloriesBurned
              }
              onChange={handleChange}
              className='bg-black border border-white/10 rounded-2xl px-5 py-4'
              required
            />

            <input
              type='text'
              name='workoutCompleted'
              placeholder='Workout Completed'
              value={
                formData.workoutCompleted
              }
              onChange={handleChange}
              className='bg-black border border-white/10 rounded-2xl px-5 py-4'
              required
            />

            <input
              type='number'
              name='waterIntake'
              placeholder='Water Intake (L)'
              value={
                formData.waterIntake
              }
              onChange={handleChange}
              className='bg-black border border-white/10 rounded-2xl px-5 py-4'
              required
            />

            <input
              type='number'
              name='stepsWalked'
              placeholder='Steps Walked'
              value={
                formData.stepsWalked
              }
              onChange={handleChange}
              className='bg-black border border-white/10 rounded-2xl px-5 py-4'
              required
            />

            <button className='bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition duration-300'>
              Add Progress
            </button>

          </form>
        </div>

        <div className='bg-zinc-900 rounded-3xl p-8 border border-white/10 mb-12'>
          <h2 className='text-3xl font-bold mb-8'>
            Monthly Streak Calendar
          </h2>

          <div className='bg-white rounded-3xl p-4 text-black overflow-x-auto'>
            <Calendar
              tileClassName={({ date }) => {
                const currentDate =
                  date.toDateString()

                if (
                  completedDates.includes(
                    currentDate
                  )
                ) {
                  return 'bg-green-500 text-white rounded-full'
                }
              }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Progress