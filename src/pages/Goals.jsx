import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL

const Goals = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const [goals, setGoals] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    currentProgress: '',
    unit: '',
    category: '',
    priority: '',
  })

  useEffect(() => {
    fetchGoals()
  }, [])

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        `${API}/api/goals`,
        {
          ...formData,
          user: userInfo._id,
        },
        config
      )

      toast.success('Goal Created')

      setFormData({
        title: '',
        description: '',
        target: '',
        currentProgress: '',
        unit: '',
        category: '',
        priority: '',
      })

      fetchGoals()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to create goal'
      )
    }
  }

  const deleteGoal = async (id) => {
    try {
      await axios.delete(
        `${API}/api/goals/${id}`,
        config
      )

      toast.success('Goal Deleted')
      fetchGoals()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to delete goal'
      )
    }
  }

  const completeGoal = async (goalId) => {
    try {
      await axios.put(
        `${API}/api/goals/${goalId}`,
        {
          completed: true,
          currentProgress: 100,
        },
        config
      )

      toast.success('Goal Completed')
      fetchGoals()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to update goal'
      )
    }
  }

  return (
    <div className='min-h-screen bg-black text-white pt-32 pb-20 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-12'>
          <h1 className='text-5xl font-bold'>My Goals</h1>

          <p className='text-gray-400 mt-4 text-lg'>
            Create and track your fitness goals
          </p>
        </div>

        <div className='bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-14'>
          <h2 className='text-3xl font-bold mb-8'>
            Create Goal
          </h2>

          <form
            onSubmit={handleSubmit}
            className='grid md:grid-cols-2 gap-6'
          >
            <input
              type='text'
              name='title'
              placeholder='Goal Title'
              value={formData.title}
              onChange={handleChange}
              className='bg-black border border-white/10 rounded-2xl px-5 py-4'
              required
            />

            <input
              type='text'
              name='category'
              placeholder='Category'
              value={formData.category}
              onChange={handleChange}
              className='bg-black border border-white/10 rounded-2xl px-5 py-4'
              required
            />

            <input
              type='number'
              name='target'
              placeholder='Target'
              value={formData.target}
              onChange={handleChange}
              className='bg-black border border-white/10 rounded-2xl px-5 py-4'
              required
            />

            <input
              type='number'
              name='currentProgress'
              placeholder='Current Progress'
              value={formData.currentProgress}
              onChange={handleChange}
              className='bg-black border border-white/10 rounded-2xl px-5 py-4'
              required
            />

            <input
              type='text'
              name='unit'
              placeholder='Unit (kg, reps, km)'
              value={formData.unit}
              onChange={handleChange}
              className='bg-black border border-white/10 rounded-2xl px-5 py-4'
              required
            />

            <select
              name='priority'
              value={formData.priority}
              onChange={handleChange}
              className='bg-black border border-white/10 rounded-2xl px-5 py-4'
              required
            >
              <option value=''>Select Priority</option>
              <option value='Low'>Low</option>
              <option value='Medium'>Medium</option>
              <option value='High'>High</option>
            </select>

            <textarea
              name='description'
              placeholder='Description'
              value={formData.description}
              onChange={handleChange}
              className='md:col-span-2 bg-black border border-white/10 rounded-2xl px-5 py-4 h-32 resize-none'
              required
            />

            <button className='md:col-span-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition duration-300'>
              Create Goal
            </button>
          </form>
        </div>

        <div>
          <h2 className='text-4xl font-bold mb-10'>
            Your Goals
          </h2>

          {goals.length === 0 ? (
            <div className='bg-zinc-900 border border-white/10 rounded-3xl p-10 text-center text-gray-400'>
              No goals created yet
            </div>
          ) : (
            <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {goals.map((goal) => (
                <div
                  key={goal._id}
                  className='bg-zinc-900 border border-white/10 rounded-3xl p-6'
                >
                  <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-2xl font-bold'>
                      {goal.title}
                    </h3>

                    {goal.completed ? (
                      <span className='bg-green-500 text-black px-4 py-2 rounded-full text-sm font-bold'>
                        Completed
                      </span>
                    ) : (
                      <span className='bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold'>
                        Pending
                      </span>
                    )}
                  </div>

                  <p className='text-gray-400 mb-6'>
                    {goal.description}
                  </p>

                  <div className='space-y-3'>
                    <p>
                      <span className='text-gray-400'>Target:</span>{' '}
                      {goal.target} {goal.unit}
                    </p>

                    <p>
                      <span className='text-gray-400'>Progress:</span>{' '}
                      {goal.currentProgress} {goal.unit}
                    </p>

                    <p>
                      <span className='text-gray-400'>Category:</span>{' '}
                      {goal.category}
                    </p>

                    <p>
                      <span className='text-gray-400'>Priority:</span>{' '}
                      {goal.priority}
                    </p>
                  </div>

                  <div className='w-full h-4 bg-black rounded-full mt-6 overflow-hidden'>
                    <div
                      style={{
                        width: `${Math.min(
                          (goal.currentProgress / goal.target) * 100,
                          100
                        )}%`,
                      }}
                      className='h-full bg-yellow-500'
                    ></div>
                  </div>

                  <div className='flex gap-4 mt-6'>
                    {!goal.completed && (
                      <button
                        onClick={() => completeGoal(goal._id)}
                        className='flex-1 bg-green-500 hover:bg-green-400 text-black py-3 rounded-2xl font-bold transition'
                      >
                        Complete
                      </button>
                    )}

                    <button
                      onClick={() => deleteGoal(goal._id)}
                      className='flex-1 bg-red-500 hover:bg-red-400 text-white py-3 rounded-2xl font-bold transition'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Goals