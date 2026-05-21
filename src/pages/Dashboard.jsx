import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Cropper from 'react-easy-crop'

import { useAuth } from '../context/AuthContext'
import { getCroppedImg } from '../utils/cropImage'

const API = import.meta.env.VITE_API_URL

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [bio, setBio] = useState('')
  const [age, setAge] = useState(18)
  const [gender, setGender] = useState('Male')
  const [phone, setPhone] = useState('')

  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [membership, setMembership] = useState('Basic')

  const [instagram, setInstagram] = useState('')
  const [youtube, setYoutube] = useState('')

  const [completedWorkouts, setCompletedWorkouts] = useState(0)
  const [caloriesBurned, setCaloriesBurned] = useState(0)

  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [assignedTrainer, setAssignedTrainer] = useState(null)

  const [goals, setGoals] = useState([])

  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }

  useEffect(() => {
    if (!userInfo?.token) {
      navigate('/login')
      return
    }

    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/users/me`,
        config
      )

      setName(data.name || '')
      setProfileImage(data.profileImage || '')
      setBio(data.bio || '')
      setAge(data.age || 18)
      setGender(data.gender || 'Male')
      setPhone(data.phone || '')

      setHeight(data.height || '')
      setWeight(data.weight || '')
      setTargetWeight(data.targetWeight || '')
      setMembership(data.membership || 'Basic')

      setInstagram(data.instagram || '')
      setYoutube(data.youtube || '')

      setCompletedWorkouts(data.completedWorkouts || 0)
      setCaloriesBurned(data.caloriesBurned || 0)

      setSelectedPlan(data.selectedPlan || null)
      setSelectedProgram(data.selectedProgram || null)
      setAssignedTrainer(data.assignedTrainer || null)

      updateUser({
        ...data,
        token: userInfo.token,
      })

      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          ...data,
          token: userInfo.token,
        })
      )
    } catch (error) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userInfo?._id && !user?._id) return

    const fetchGoals = async () => {
      try {
        const userId = userInfo?._id || user?._id

        const { data } = await axios.get(
          `${API}/api/goals/user/${userId}`
        )

        setGoals(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchGoals()
  }, [userInfo?._id, user?._id])

  const bmi =
    height && weight
      ? (weight / ((height / 100) * (height / 100))).toFixed(1)
      : 0

  const uploadImage = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageSrc(URL.createObjectURL(file))
  }

  const onCropComplete = useCallback((_, area) => {
    setCroppedAreaPixels(area)
  }, [])

  const saveImage = async () => {
    try {
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      )

      const formData = new FormData()
      formData.append('file', croppedBlob)
      formData.append('upload_preset', 'gym_upload')

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/deffjmfao/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      )

      const cloudinaryData = await res.json()

      const { data } = await axios.put(
        `${API}/api/users/profile/${userInfo._id}`,
        {
          profileImage: cloudinaryData.secure_url,
        },
        config
      )

      setProfileImage(data.profileImage)

      updateUser({
        ...data,
        token: userInfo.token,
      })

      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          ...data,
          token: userInfo.token,
        })
      )

      setImageSrc(null)
      toast.success('Image Updated')
    } catch (err) {
      toast.error('Image Upload Failed')
    }
  }

  const saveProfile = async () => {
    try {
      const { data } = await axios.put(
        `${API}/api/users/profile/${userInfo._id}`,
        {
          name,
          profileImage,
          bio,
          age,
          gender,
          phone,
          height,
          weight,
          targetWeight,
          bmi,
          membership,
          instagram,
          youtube,
        },
        config
      )

      updateUser({
        ...data,
        token: userInfo.token,
      })

      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          ...data,
          token: userInfo.token,
        })
      )

      setName(data.name || '')
      setProfileImage(data.profileImage || '')
      setBio(data.bio || '')
      setAge(data.age || 18)
      setGender(data.gender || 'Male')
      setPhone(data.phone || '')
      setHeight(data.height || '')
      setWeight(data.weight || '')
      setTargetWeight(data.targetWeight || '')
      setMembership(data.membership || 'Basic')
      setInstagram(data.instagram || '')
      setYoutube(data.youtube || '')

      setSelectedPlan(data.selectedPlan || null)
      setSelectedProgram(data.selectedProgram || null)
      setAssignedTrainer(data.assignedTrainer || null)

      toast.success('Profile Updated')
    } catch (err) {
      toast.error('Update Failed')
    }
  }

  const updateProgress = async (id, amount) => {
    try {
      const { data } = await axios.put(
        `${API}/api/goals/${id}/progress/increment`,
        { amount },
        config
      )

      setGoals((prev) =>
        prev.map((g) => (g._id === id ? data : g))
      )

      toast.success('Progress Updated')
    } catch (err) {
      toast.error('Failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <img
                key={profileImage}
                src={
                  profileImage ||
                  'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                }
                className="w-28 h-28 rounded-full object-cover border-4 border-yellow-500"
                alt="profile"
              />

              <h2 className="mt-4 text-2xl font-bold">
                {name}
              </h2>

              <p className="text-gray-400 mt-2 text-sm">
                {bio || 'No bio added'}
              </p>

              <span className="mt-4 px-4 py-1 rounded-full bg-yellow-500 text-black font-bold text-sm">
                {membership} Member
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <InfoCard title="BMI" value={bmi} />
              <InfoCard title="Age" value={age} />
              <InfoCard title="Height" value={`${height || 0} cm`} />
              <InfoCard title="Weight" value={`${weight || 0} kg`} />
            </div>
          </div>

          <div className="lg:col-span-2 bg-zinc-900/80 border border-white/10 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">
              Your Fitness Selection
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <SelectionCard
                title="Selected Plan"
                image={selectedPlan?.image}
                heading={selectedPlan?.title}
                subText={
                  selectedPlan
                    ? `₹${selectedPlan.finalPrice || selectedPlan.price || 0}`
                    : 'No plan selected'
                }
                detail={
                  selectedPlan
                    ? `${selectedPlan.durationInDays || 30} days`
                    : 'Choose a plan from pricing page'
                }
              />

              <SelectionCard
                title="Selected Program"
                image={selectedProgram?.image}
                heading={selectedProgram?.title}
                subText={
                  selectedProgram
                    ? selectedProgram.category || 'Program'
                    : 'No program selected'
                }
                detail={
                  selectedProgram
                    ? `${selectedProgram.durationWeeks || 4} weeks`
                    : 'Join a program from programs section'
                }
              />

              <SelectionCard
                title="Assigned Trainer"
                image={assignedTrainer?.image}
                heading={assignedTrainer?.name}
                subText={
                  assignedTrainer
                    ? Array.isArray(assignedTrainer.specialization)
                      ? assignedTrainer.specialization.join(', ')
                      : 'Fitness Coach'
                    : 'No trainer assigned'
                }
                detail={
                  assignedTrainer
                    ? `${assignedTrainer.experience || 0} years experience`
                    : 'Select trainer from trainers section'
                }
              />
            </div>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <StatBox title="Completed Workouts" value={completedWorkouts} />
          <StatBox title="Calories Burned" value={caloriesBurned} />
        </div>

        <div className="mt-8 bg-zinc-900/80 border border-white/10 rounded-3xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">
            Edit Profile
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Name" value={name} setValue={setName} />
            <Input label="Phone" value={phone} setValue={setPhone} />
            <Input label="Age" type="number" value={age} setValue={setAge} />

            <div>
              <label className="text-sm text-gray-400">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full mt-1 p-3 bg-black rounded-xl border border-white/10"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <Input label="Height" type="number" value={height} setValue={setHeight} />
            <Input label="Weight" type="number" value={weight} setValue={setWeight} />
            <Input label="Target Weight" type="number" value={targetWeight} setValue={setTargetWeight} />

            <div>
              <label className="text-sm text-gray-400">Membership</label>
              <select
                value={membership}
                onChange={(e) => setMembership(e.target.value)}
                className="w-full mt-1 p-3 bg-black rounded-xl border border-white/10"
              >
                <option>Basic</option>
                <option>Premium</option>
                <option>Elite</option>
              </select>
            </div>

            <Input label="Instagram" value={instagram} setValue={setInstagram} />
            <Input label="YouTube" value={youtube} setValue={setYoutube} />
          </div>

          <label className="text-sm text-gray-400 mt-4 block">
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            className="w-full mt-1 p-3 bg-black rounded-xl border border-white/10 outline-none"
          />

          <label className="text-sm text-gray-400 mt-4 block">
            Profile Image
          </label>

          <input type="file" onChange={uploadImage} className="mt-2" />

          {imageSrc && (
            <div className="mt-4">
              <div className="h-[240px] bg-black relative rounded-xl overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <button
                onClick={saveImage}
                className="mt-3 bg-yellow-500 text-black px-5 py-2 rounded-xl font-bold hover:bg-yellow-400"
              >
                Save Image
              </button>
            </div>
          )}

          <button
            onClick={saveProfile}
            className="w-full mt-6 bg-yellow-500 text-black py-3 rounded-xl font-bold hover:scale-[1.01] transition"
          >
            Save Changes
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Your Goals
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {goals.length === 0 ? (
              <p className="text-gray-400">
                No goals added yet.
              </p>
            ) : (
              goals.map((goal) => (
                <div
                  key={goal._id}
                  className="bg-zinc-900 p-5 rounded-2xl border border-white/10"
                >
                  <h3 className="text-yellow-400 font-bold">
                    {goal.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {goal.currentProgress}/{goal.target} {goal.unit}
                  </p>

                  <div className="h-2 bg-gray-700 rounded mt-3">
                    <div
                      className="h-2 bg-yellow-500 rounded"
                      style={{
                        width: `${Math.min(
                          (goal.currentProgress / goal.target) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => updateProgress(goal._id, 1)}
                      className="bg-green-600 px-4 py-2 rounded-lg"
                    >
                      +1
                    </button>

                    <button
                      onClick={() => updateProgress(goal._id, 5)}
                      className="bg-blue-600 px-4 py-2 rounded-lg"
                    >
                      +5
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

const SelectionCard = ({
  title,
  image,
  heading,
  subText,
  detail,
}) => {
  return (
    <div className="bg-black/70 border border-white/10 rounded-2xl overflow-hidden">
      {image ? (
        <img
          src={image}
          alt={heading || title}
          className="w-full h-36 object-cover"
        />
      ) : (
        <div className="w-full h-36 bg-zinc-800 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <div className="p-4">
        <p className="text-yellow-500 text-sm font-bold">
          {title}
        </p>

        <h3 className="text-xl font-bold mt-1">
          {heading || 'Not Selected'}
        </h3>

        <p className="text-gray-400 text-sm mt-2">
          {subText}
        </p>

        <p className="text-gray-500 text-xs mt-2">
          {detail}
        </p>
      </div>
    </div>
  )
}

const Input = ({ label, value, setValue, type = 'text' }) => {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full mt-1 p-3 bg-black rounded-xl border border-white/10 outline-none"
      />
    </div>
  )
}

const InfoCard = ({ title, value }) => {
  return (
    <div className="bg-black/70 rounded-xl p-4 text-center border border-white/10">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-yellow-400 font-bold mt-1">{value}</h3>
    </div>
  )
}

const StatBox = ({ title, value }) => {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-3xl font-bold text-yellow-400 mt-2">{value}</h2>
    </div>
  )
}

export default Dashboard