import { useEffect, useState, useCallback, useMemo } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../utils/cropImage'

const API = `${import.meta.env.VITE_API_URL}/api/admin`

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [trainers, setTrainers] = useState([])
  const [programs, setPrograms] = useState([])
  const [pricingPlans, setPricingPlans] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${userInfo?.token}`,
      },
    }
  }, [userInfo?.token])

  const [goalForm, setGoalForm] = useState({
    userId: '',
    title: '',
    category: 'Custom',
    target: '',
    unit: '',
    priority: 'Medium',
  })

  const [trainerAssign, setTrainerAssign] = useState({
    userId: '',
    trainerId: '',
  })

  const [trainerForm, setTrainerForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    specialization: '',
    bio: '',
    monthlyFee: '',
    image: '',
  })

  const [programForm, setProgramForm] = useState({
    title: '',
    description: '',
    category: 'Custom',
    level: 'Beginner',
    durationWeeks: 4,
    price: 0,
    image: '',
  })

  const [pricingForm, setPricingForm] = useState({
    title: '',
    description: '',
    price: '',
    durationInDays: 30,
    type: 'Basic',
    discountPercentage: 0,
    features: '',
    image: '',
  })

  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    message: '',
    rating: 5,
    image: '',
  })

  const fetchAdminData = useCallback(async () => {
    try {
      if (!userInfo?.token) {
        toast.error('Admin not logged in')
        setLoading(false)
        return
      }

      const requests = await Promise.allSettled([
        axios.get(`${API}/stats`, config),
        axios.get(`${API}/users`, config),
        axios.get(`${API}/trainers`, config),
        axios.get(`${API}/programs`, config),
        axios.get(`${API}/pricing`, config),
        axios.get(`${API}/testimonials`, config),
      ])

      const [
        statsRes,
        usersRes,
        trainersRes,
        programsRes,
        pricingRes,
        testimonialsRes,
      ] = requests

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data)
      }

      if (usersRes.status === 'fulfilled') {
        setUsers(Array.isArray(usersRes.value.data) ? usersRes.value.data : [])
      }

      if (trainersRes.status === 'fulfilled') {
        setTrainers(
          Array.isArray(trainersRes.value.data) ? trainersRes.value.data : []
        )
      }

      if (programsRes.status === 'fulfilled') {
        setPrograms(
          Array.isArray(programsRes.value.data) ? programsRes.value.data : []
        )
      }

      if (pricingRes.status === 'fulfilled') {
        setPricingPlans(
          Array.isArray(pricingRes.value.data) ? pricingRes.value.data : []
        )
      }

      if (testimonialsRes.status === 'fulfilled') {
        setTestimonials(
          Array.isArray(testimonialsRes.value.data)
            ? testimonialsRes.value.data
            : []
        )
      }

      requests.forEach((result) => {
        if (result.status === 'rejected') {
          console.log(
            'Admin API Error:',
            result.reason?.response?.data?.message ||
              result.reason?.response?.data ||
              result.reason?.message
          )
        }
      })
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }, [userInfo?.token, config])

  useEffect(() => {
    fetchAdminData()
  }, [fetchAdminData])

  const changeMembership = async (id, membership) => {
    try {
      await axios.put(`${API}/membership/${id}`, { membership }, config)
      toast.success('Membership updated')
      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to update membership')
    }
  }

  const banUser = async (id) => {
    if (!confirm('Are you sure you want to ban this user?')) return

    try {
      await axios.put(`${API}/ban/${id}`, {}, config)
      toast.success('User banned')
      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to ban user')
    }
  }

  const unbanUser = async (id) => {
    try {
      await axios.put(`${API}/unban/${id}`, {}, config)
      toast.success('User unbanned')
      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to unban user')
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user permanently?')) return

    try {
      await axios.delete(`${API}/user/${id}`, config)
      toast.success('User deleted')
      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const assignGoal = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        `${API}/assign-goal/${goalForm.userId}`,
        {
          title: goalForm.title,
          category: goalForm.category,
          target: Number(goalForm.target),
          unit: goalForm.unit,
          priority: goalForm.priority,
        },
        config
      )

      toast.success('Goal assigned')

      setGoalForm({
        userId: '',
        title: '',
        category: 'Custom',
        target: '',
        unit: '',
        priority: 'Medium',
      })

      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to assign goal')
    }
  }

  const assignTrainer = async (e) => {
    e.preventDefault()

    try {
      await axios.put(
        `${API}/assign-trainer/${trainerAssign.userId}`,
        { trainerId: trainerAssign.trainerId },
        config
      )

      toast.success('Trainer assigned')

      setTrainerAssign({
        userId: '',
        trainerId: '',
      })

      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to assign trainer')
    }
  }

  const createTrainer = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        `${API}/trainers`,
        {
          ...trainerForm,
          experience: Number(trainerForm.experience),
          monthlyFee: Number(trainerForm.monthlyFee),
          specialization: trainerForm.specialization
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        },
        config
      )

      toast.success('Trainer added')

      setTrainerForm({
        name: '',
        email: '',
        phone: '',
        experience: '',
        specialization: '',
        bio: '',
        monthlyFee: '',
        image: '',
      })

      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to add trainer')
    }
  }

  const deleteTrainer = async (id) => {
    if (!confirm('Delete this trainer?')) return

    try {
      await axios.delete(`${API}/trainers/${id}`, config)
      toast.success('Trainer deleted')
      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to delete trainer')
    }
  }

  const createProgram = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        `${API}/programs`,
        {
          ...programForm,
          durationWeeks: Number(programForm.durationWeeks),
          price: Number(programForm.price),
        },
        config
      )

      toast.success('Program added')

      setProgramForm({
        title: '',
        description: '',
        category: 'Custom',
        level: 'Beginner',
        durationWeeks: 4,
        price: 0,
        image: '',
      })

      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to add program')
    }
  }

  const deleteProgram = async (id) => {
    if (!confirm('Delete this program?')) return

    try {
      await axios.delete(`${API}/programs/${id}`, config)
      toast.success('Program deleted')
      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to delete program')
    }
  }

  const createPricing = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        `${API}/pricing`,
        {
          ...pricingForm,
          price: Number(pricingForm.price),
          durationInDays: Number(pricingForm.durationInDays),
          discountPercentage: Number(pricingForm.discountPercentage),
          features: pricingForm.features
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        },
        config
      )

      toast.success('Pricing plan added')

      setPricingForm({
        title: '',
        description: '',
        price: '',
        durationInDays: 30,
        type: 'Basic',
        discountPercentage: 0,
        features: '',
        image: '',
      })

      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to add pricing')
    }
  }

  const deletePricing = async (id) => {
    if (!confirm('Delete this pricing plan?')) return

    try {
      await axios.delete(`${API}/pricing/${id}`, config)
      toast.success('Pricing deleted')
      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to delete pricing')
    }
  }

  const createTestimonial = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        `${API}/testimonials`,
        {
          ...testimonialForm,
          rating: Number(testimonialForm.rating),
        },
        config
      )

      toast.success('Testimonial added')

      setTestimonialForm({
        name: '',
        role: '',
        message: '',
        rating: 5,
        image: '',
      })

      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to add testimonial')
    }
  }

  const deleteTestimonial = async (id) => {
    if (!confirm('Delete this testimonial?')) return

    try {
      await axios.delete(`${API}/testimonials/${id}`, config)
      toast.success('Testimonial deleted')
      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to delete testimonial')
    }
  }

  const clearChat = async () => {
    if (!confirm('Clear all chat messages?')) return

    try {
      await axios.delete(`${API}/chat/clear`, config)
      toast.success('Chat cleared')
      fetchAdminData()
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to clear chat')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Admin Dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-20 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-3">
              Manage users, trainers, programs, pricing, testimonials and goals
            </p>
          </div>

          <button
            onClick={clearChat}
            className="px-6 py-3 rounded-2xl font-bold bg-red-600 hover:bg-red-500 text-white transition"
          >
            Clear Chat
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <StatCard title="Users" value={stats?.users || 0} />
          <StatCard title="Goals" value={stats?.goals || 0} />
          <StatCard title="Trainers" value={stats?.trainers || 0} />
          <StatCard title="Programs" value={stats?.programs || 0} />
          <StatCard title="Testimonials" value={stats?.testimonials || 0} />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
          {[
            'users',
            'assign-goal',
            'assign-trainer',
            'trainers',
            'programs',
            'pricing',
            'testimonials',
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-yellow-500 text-black'
                  : 'bg-zinc-900 text-white border border-white/10 hover:border-yellow-500'
              }`}
            >
              {tab.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <Section title="Membership & Users">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="py-3">User</th>
                    <th>Email</th>
                    <th>Membership</th>
                    <th>Trainer</th>
                    <th>Status</th>
                    <th>Admin</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-white/10">
                      <td className="py-4 flex items-center gap-3">
                        <img
                          src={user.profileImage || '/default-avatar.png'}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {user.name}
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <select
                          value={user.membership}
                          onChange={(e) =>
                            changeMembership(user._id, e.target.value)
                          }
                          className="bg-black border border-white/10 rounded-xl px-3 py-2"
                        >
                          <option>Basic</option>
                          <option>Premium</option>
                          <option>Elite</option>
                        </select>
                      </td>

                      <td>{user.assignedTrainer?.name || 'Not Assigned'}</td>

                      <td>
                        {user.isActive ? (
                          <span className="text-green-400 font-semibold">
                            Active
                          </span>
                        ) : (
                          <span className="text-red-400 font-semibold">
                            Banned
                          </span>
                        )}
                      </td>

                      <td>{user.isAdmin ? 'Admin' : 'User'}</td>

                      <td className="flex gap-2 py-4">
                        {user.isActive ? (
                          <button
                            disabled={user.isAdmin}
                            onClick={() => banUser(user._id)}
                            className="px-4 py-2 rounded-xl bg-orange-500 text-black font-bold hover:bg-orange-400 disabled:opacity-40"
                          >
                            Ban
                          </button>
                        ) : (
                          <button
                            onClick={() => unbanUser(user._id)}
                            className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500"
                          >
                            Unban
                          </button>
                        )}

                        <button
                          disabled={user.isAdmin}
                          onClick={() => deleteUser(user._id)}
                          className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <p className="text-gray-400 text-center py-8">
                  No users found.
                </p>
              )}
            </div>
          </Section>
        )}

        {activeTab === 'assign-goal' && (
          <Section title="Assign Goal">
            <form onSubmit={assignGoal} className="grid md:grid-cols-2 gap-4">
              <Select
                value={goalForm.userId}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, userId: e.target.value })
                }
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </Select>

              <Input
                placeholder="Goal Title"
                value={goalForm.title}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, title: e.target.value })
                }
                required
              />

              <Select
                value={goalForm.category}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, category: e.target.value })
                }
              >
                <option>Workout</option>
                <option>Cardio</option>
                <option>Water</option>
                <option>Diet</option>
                <option>Running</option>
                <option>Steps</option>
                <option>Weight</option>
                <option>Custom</option>
              </Select>

              <Input
                type="number"
                placeholder="Target"
                value={goalForm.target}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, target: e.target.value })
                }
                required
              />

              <Input
                placeholder="Unit: kg, steps, days"
                value={goalForm.unit}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, unit: e.target.value })
                }
                required
              />

              <Select
                value={goalForm.priority}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, priority: e.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Select>

              <button className="md:col-span-2 bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400">
                Assign Goal
              </button>
            </form>
          </Section>
        )}

        {activeTab === 'assign-trainer' && (
          <Section title="Assign Trainer">
            <form onSubmit={assignTrainer} className="grid md:grid-cols-2 gap-4">
              <Select
                value={trainerAssign.userId}
                onChange={(e) =>
                  setTrainerAssign({
                    ...trainerAssign,
                    userId: e.target.value,
                  })
                }
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </Select>

              <Select
                value={trainerAssign.trainerId}
                onChange={(e) =>
                  setTrainerAssign({
                    ...trainerAssign,
                    trainerId: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer._id} value={trainer._id}>
                    {trainer.name}
                  </option>
                ))}
              </Select>

              <button className="md:col-span-2 bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400">
                Assign Trainer
              </button>
            </form>
          </Section>
        )}

        {activeTab === 'trainers' && (
          <Section title="Trainer Management">
            <form onSubmit={createTrainer} className="grid md:grid-cols-2 gap-4 mb-8">
              <ImageCropInput
                label="Trainer Image"
                value={trainerForm.image}
                onChange={(image) =>
                  setTrainerForm({ ...trainerForm, image })
                }
              />

              <Input
                placeholder="Trainer Name"
                value={trainerForm.name}
                onChange={(e) =>
                  setTrainerForm({ ...trainerForm, name: e.target.value })
                }
                required
              />

              <Input
                placeholder="Email"
                value={trainerForm.email}
                onChange={(e) =>
                  setTrainerForm({ ...trainerForm, email: e.target.value })
                }
              />

              <Input
                placeholder="Phone"
                value={trainerForm.phone}
                onChange={(e) =>
                  setTrainerForm({ ...trainerForm, phone: e.target.value })
                }
              />

              <Input
                type="number"
                placeholder="Experience Years"
                value={trainerForm.experience}
                onChange={(e) =>
                  setTrainerForm({
                    ...trainerForm,
                    experience: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Specialization comma separated"
                value={trainerForm.specialization}
                onChange={(e) =>
                  setTrainerForm({
                    ...trainerForm,
                    specialization: e.target.value,
                  })
                }
              />

              <Input
                type="number"
                placeholder="Monthly Fee"
                value={trainerForm.monthlyFee}
                onChange={(e) =>
                  setTrainerForm({
                    ...trainerForm,
                    monthlyFee: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Bio"
                value={trainerForm.bio}
                onChange={(e) =>
                  setTrainerForm({ ...trainerForm, bio: e.target.value })
                }
              />

              <button className="bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400">
                Add Trainer
              </button>
            </form>

            <CardGrid>
              {trainers.map((trainer) => (
                <ItemCard key={trainer._id} title={trainer.name}>
                  {trainer.image && (
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-full h-44 object-cover rounded-xl mb-4"
                    />
                  )}

                  <p>{trainer.specialization?.join(', ') || 'Fitness Trainer'}</p>
                  <p>Experience: {trainer.experience || 0} years</p>
                  <p>₹{trainer.monthlyFee || 0}/month</p>

                  <button
                    onClick={() => deleteTrainer(trainer._id)}
                    className="mt-4 px-4 py-2 bg-red-600 rounded-xl font-bold"
                  >
                    Delete
                  </button>
                </ItemCard>
              ))}
            </CardGrid>
          </Section>
        )}

        {activeTab === 'programs' && (
          <Section title="Program Management">
            <form onSubmit={createProgram} className="grid md:grid-cols-2 gap-4 mb-8">
              <ImageCropInput
                label="Program Image"
                value={programForm.image}
                onChange={(image) =>
                  setProgramForm({ ...programForm, image })
                }
              />

              <Input
                placeholder="Program Title"
                value={programForm.title}
                onChange={(e) =>
                  setProgramForm({ ...programForm, title: e.target.value })
                }
                required
              />

              <Input
                placeholder="Description"
                value={programForm.description}
                onChange={(e) =>
                  setProgramForm({
                    ...programForm,
                    description: e.target.value,
                  })
                }
              />

              <Select
                value={programForm.category}
                onChange={(e) =>
                  setProgramForm({ ...programForm, category: e.target.value })
                }
              >
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Cardio</option>
                <option>Yoga</option>
                <option>Strength</option>
                <option>Flexibility</option>
                <option>Custom</option>
              </Select>

              <Select
                value={programForm.level}
                onChange={(e) =>
                  setProgramForm({ ...programForm, level: e.target.value })
                }
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </Select>

              <Input
                type="number"
                placeholder="Duration Weeks"
                value={programForm.durationWeeks}
                onChange={(e) =>
                  setProgramForm({
                    ...programForm,
                    durationWeeks: e.target.value,
                  })
                }
              />

              <Input
                type="number"
                placeholder="Price"
                value={programForm.price}
                onChange={(e) =>
                  setProgramForm({ ...programForm, price: e.target.value })
                }
              />

              <button className="md:col-span-2 bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400">
                Add Program
              </button>
            </form>

            <CardGrid>
              {programs.map((program) => (
                <ItemCard key={program._id} title={program.title}>
                  {program.image && (
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-44 object-cover rounded-xl mb-4"
                    />
                  )}

                  <p>{program.category}</p>
                  <p>Level: {program.level}</p>
                  <p>Duration: {program.durationWeeks} weeks</p>
                  <p>₹{program.price}</p>

                  <button
                    onClick={() => deleteProgram(program._id)}
                    className="mt-4 px-4 py-2 bg-red-600 rounded-xl font-bold"
                  >
                    Delete
                  </button>
                </ItemCard>
              ))}
            </CardGrid>
          </Section>
        )}

        {activeTab === 'pricing' && (
          <Section title="Pricing Management">
            <form onSubmit={createPricing} className="grid md:grid-cols-2 gap-4 mb-8">
              <ImageCropInput
                label="Pricing Plan Image"
                value={pricingForm.image}
                onChange={(image) =>
                  setPricingForm({ ...pricingForm, image })
                }
              />

              <Input
                placeholder="Plan Title"
                value={pricingForm.title}
                onChange={(e) =>
                  setPricingForm({ ...pricingForm, title: e.target.value })
                }
                required
              />

              <Input
                placeholder="Description"
                value={pricingForm.description}
                onChange={(e) =>
                  setPricingForm({
                    ...pricingForm,
                    description: e.target.value,
                  })
                }
              />

              <Input
                type="number"
                placeholder="Price"
                value={pricingForm.price}
                onChange={(e) =>
                  setPricingForm({ ...pricingForm, price: e.target.value })
                }
                required
              />

              <Input
                type="number"
                placeholder="Duration In Days"
                value={pricingForm.durationInDays}
                onChange={(e) =>
                  setPricingForm({
                    ...pricingForm,
                    durationInDays: e.target.value,
                  })
                }
              />

              <Select
                value={pricingForm.type}
                onChange={(e) =>
                  setPricingForm({ ...pricingForm, type: e.target.value })
                }
              >
                <option>Basic</option>
                <option>Premium</option>
                <option>Elite</option>
              </Select>

              <Input
                type="number"
                placeholder="Discount Percentage"
                value={pricingForm.discountPercentage}
                onChange={(e) =>
                  setPricingForm({
                    ...pricingForm,
                    discountPercentage: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Features comma separated"
                value={pricingForm.features}
                onChange={(e) =>
                  setPricingForm({ ...pricingForm, features: e.target.value })
                }
              />

              <button className="bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400">
                Add Pricing
              </button>
            </form>

            <CardGrid>
              {pricingPlans.map((plan) => (
                <ItemCard key={plan._id} title={plan.title}>
                  {plan.image && (
                    <img
                      src={plan.image}
                      alt={plan.title}
                      className="w-full h-44 object-cover rounded-xl mb-4"
                    />
                  )}

                  <p>{plan.type}</p>
                  <p>₹{plan.finalPrice || plan.price}</p>
                  <p>{plan.durationInDays} days</p>

                  <button
                    onClick={() => deletePricing(plan._id)}
                    className="mt-4 px-4 py-2 bg-red-600 rounded-xl font-bold"
                  >
                    Delete
                  </button>
                </ItemCard>
              ))}
            </CardGrid>
          </Section>
        )}

        {activeTab === 'testimonials' && (
          <Section title="Testimonials Management">
            <form onSubmit={createTestimonial} className="grid md:grid-cols-2 gap-4 mb-8">
              <ImageCropInput
                label="Testimonial Image"
                value={testimonialForm.image}
                onChange={(image) =>
                  setTestimonialForm({ ...testimonialForm, image })
                }
              />

              <Input
                placeholder="Name"
                value={testimonialForm.name}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    name: e.target.value,
                  })
                }
                required
              />

              <Input
                placeholder="Role"
                value={testimonialForm.role}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    role: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Message"
                value={testimonialForm.message}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    message: e.target.value,
                  })
                }
                required
              />

              <Input
                type="number"
                placeholder="Rating"
                value={testimonialForm.rating}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    rating: e.target.value,
                  })
                }
              />

              <button className="md:col-span-2 bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400">
                Add Testimonial
              </button>
            </form>

            <CardGrid>
              {testimonials.map((item) => (
                <ItemCard key={item._id} title={item.name}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-full mb-4"
                    />
                  )}

                  <p>{item.role}</p>
                  <p>{item.message}</p>
                  <p>⭐ {item.rating}</p>

                  <button
                    onClick={() => deleteTestimonial(item._id)}
                    className="mt-4 px-4 py-2 bg-red-600 rounded-xl font-bold"
                  >
                    Delete
                  </button>
                </ItemCard>
              ))}
            </CardGrid>
          </Section>
        )}

      </div>
    </div>
  )
}

const ImageCropInput = ({ label, value, onChange }) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onSelectFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      setImageSrc(reader.result)
    }

    reader.readAsDataURL(file)
  }

  const cropImage = async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return

      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)

      onChange(croppedImage)
      setImageSrc(null)
    } catch (error) {
      console.log(error)
      toast.error('Failed to crop image')
    }
  }

  return (
    <div className="md:col-span-2">
      <label className="block text-gray-300 mb-2 font-semibold">
        {label}
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
      />

      {value && (
        <img
          src={value}
          alt="Preview"
          className="w-28 h-28 object-cover rounded-2xl mt-4 border border-white/10"
        />
      )}

      {imageSrc && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-3xl p-5 w-full max-w-lg">
            <div className="relative h-80 bg-black rounded-2xl overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) =>
                  setCroppedAreaPixels(croppedPixels)
                }
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full mt-5"
            />

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={cropImage}
                className="flex-1 bg-yellow-500 text-black py-3 rounded-xl font-bold"
              >
                Crop & Save
              </button>

              <button
                type="button"
                onClick={() => setImageSrc(null)}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Section = ({ title, children }) => (
  <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 mt-8">
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    {children}
  </div>
)

const CardGrid = ({ children }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
    {children}
  </div>
)

const ItemCard = ({ title, children }) => (
  <div className="bg-black border border-white/10 rounded-2xl p-5">
    <h3 className="text-xl font-bold text-yellow-500 mb-3">{title}</h3>
    <div className="text-gray-400 space-y-1">{children}</div>
  </div>
)

const StatCard = ({ title, value }) => (
  <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
    <h2 className="text-4xl font-bold text-yellow-500">{value}</h2>
    <p className="text-gray-400 mt-3">{title}</p>
  </div>
)

const Input = (props) => (
  <input
    {...props}
    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
  />
)

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
  >
    {children}
  </select>
)

export default AdminDashboard