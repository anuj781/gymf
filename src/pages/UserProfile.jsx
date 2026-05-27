import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

import {
  FaComments,
  FaEnvelope,
  FaUser,
  FaPhoneAlt,
  FaRulerVertical,
  FaWeight,
  FaBullseye,
  FaDumbbell,
  FaFire,
  FaInstagram,
  FaYoutube,
  FaVenusMars,
  FaCrown,
  FaUserTie,
  FaClipboardList,
} from 'react-icons/fa'

const API = `${import.meta.env.VITE_API_URL}/api/private-chat`

const UserProfile = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)

  const [loading, setLoading] = useState(true)

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }

  useEffect(() => {
    fetchProfile()
  }, [id])

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(
        `${API}/profile/${id}`,
        config
      )

      setProfile(data)
    } catch (error) {
      console.log(error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  const startChat = async () => {
    try {
      const { data } = await axios.post(
        `${API}/conversation/${id}`,
        {},
        config
      )

      navigate(`/chat/${data._id}`)
    } catch (error) {
      console.log(error.response?.data || error.message)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center'>
        Loading Profile...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center'>
        User not found
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-black text-white pt-32 pb-20 px-4'>
      <div className='max-w-7xl mx-auto'>

        {/* TOP PROFILE SECTION */}

        <div className='bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl'>

          <div className='flex flex-col lg:flex-row items-center gap-10'>

            <img
              src={
                profile.profileImage ||
                profile.image ||
                'https://cdn-icons-png.flaticon.com/512/149/149071.png'
              }
              alt={profile.name}
              className='w-44 h-44 rounded-full object-cover border-4 border-yellow-500 shadow-xl'
            />

            <div className='flex-1 text-center lg:text-left'>

              <h1 className='text-4xl md:text-5xl font-bold'>
                {profile.name}
              </h1>

              <p className='text-gray-400 mt-4 flex items-center justify-center lg:justify-start gap-2'>
                <FaEnvelope />
                {profile.email}
              </p>

              <p className='text-gray-300 mt-6 leading-relaxed max-w-3xl'>
                {profile.bio || 'This user has not added a bio yet.'}
              </p>

              <div className='flex flex-wrap gap-3 mt-6 justify-center lg:justify-start'>

                <span className='bg-yellow-500 text-black px-5 py-2 rounded-full font-bold'>
                  {profile.membership || 'Basic'} Member
                </span>

                <span className='bg-white/10 px-5 py-2 rounded-full'>
                  {profile.isActive ? 'Active' : 'Inactive'}
                </span>

                {profile.isEmailVerified && (
                  <span className='bg-green-500/20 text-green-400 px-5 py-2 rounded-full'>
                    Verified
                  </span>
                )}

              </div>

              <button
                onClick={startChat}
                className='mt-8 inline-flex items-center gap-3 bg-yellow-500 text-black px-8 py-4 rounded-2xl font-bold hover:bg-yellow-400 transition'
              >
                <FaComments />
                Start Private Chat
              </button>

            </div>

          </div>

        </div>

        {/* USER DETAILS */}

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>

          <InfoCard
            icon={<FaUser />}
            title='Age'
            value={profile.age || 'N/A'}
          />

          <InfoCard
            icon={<FaVenusMars />}
            title='Gender'
            value={profile.gender || 'N/A'}
          />

          <InfoCard
            icon={<FaPhoneAlt />}
            title='Phone'
            value={profile.phone || 'N/A'}
          />

          <InfoCard
            icon={<FaCrown />}
            title='Membership'
            value={profile.membership || 'Basic'}
          />

        </div>

        {/* FITNESS DETAILS */}

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>

          <InfoCard
            icon={<FaRulerVertical />}
            title='Height'
            value={
              profile.height
                ? `${profile.height} cm`
                : 'N/A'
            }
          />

          <InfoCard
            icon={<FaWeight />}
            title='Weight'
            value={
              profile.weight
                ? `${profile.weight} kg`
                : 'N/A'
            }
          />

          <InfoCard
            icon={<FaBullseye />}
            title='Target Weight'
            value={
              profile.targetWeight
                ? `${profile.targetWeight} kg`
                : 'N/A'
            }
          />

          <InfoCard
            icon={<FaFire />}
            title='BMI'
            value={profile.bmi || 'N/A'}
          />

        </div>

        {/* WORKOUT STATS */}

        <div className='grid md:grid-cols-2 gap-5 mb-8'>

          <InfoCard
            icon={<FaDumbbell />}
            title='Completed Workouts'
            value={profile.completedWorkouts || 0}
          />

          <InfoCard
            icon={<FaFire />}
            title='Calories Burned'
            value={profile.caloriesBurned || 0}
          />

        </div>

        {/* TRAINER PROGRAM PLAN */}

        <div className='grid md:grid-cols-3 gap-5 mb-8'>

          <InfoCard
            icon={<FaUserTie />}
            title='Assigned Trainer'
            value={
              profile.assignedTrainer?.name ||
              profile.trainer?.name ||
              'No Trainer Assigned'
            }
          />

          <InfoCard
            icon={<FaClipboardList />}
            title='Assigned Program'
            value={
              profile.assignedProgram?.title ||
              profile.program?.title ||
              'No Program Assigned'
            }
          />

          <InfoCard
            icon={<FaCrown />}
            title='Pricing Plan'
            value={
              profile.pricingPlan?.name ||
              profile.plan?.name ||
              profile.membership ||
              'Basic'
            }
          />

        </div>

        {/* SOCIAL LINKS */}

        <div className='bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-xl'>

          <h2 className='text-2xl font-bold mb-6'>
            Social Links
          </h2>

          <div className='flex flex-wrap gap-4'>

            {profile.instagram ? (
              <a
                href={profile.instagram}
                target='_blank'
                rel='noreferrer'
                className='flex items-center gap-3 bg-pink-600 px-6 py-3 rounded-2xl font-bold hover:bg-pink-500 transition'
              >
                <FaInstagram />
                Instagram
              </a>
            ) : (
              <div className='bg-white/5 px-6 py-3 rounded-2xl text-gray-400'>
                No Instagram Added
              </div>
            )}

            {profile.youtube ? (
              <a
                href={profile.youtube}
                target='_blank'
                rel='noreferrer'
                className='flex items-center gap-3 bg-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-500 transition'
              >
                <FaYoutube />
                YouTube
              </a>
            ) : (
              <div className='bg-white/5 px-6 py-3 rounded-2xl text-gray-400'>
                No YouTube Added
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}

const InfoCard = ({ icon, title, value }) => {
  return (
    <div className='bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-xl'>

      <div className='text-yellow-500 text-2xl mb-4'>
        {icon}
      </div>

      <p className='text-gray-400 text-sm'>
        {title}
      </p>

      <h3 className='text-xl font-bold mt-2 break-words'>
        {value}
      </h3>

    </div>
  )
}

export default UserProfile