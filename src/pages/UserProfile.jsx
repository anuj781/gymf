import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

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
  FaTrash,
  FaStar,
  FaRupeeSign,
  FaCalendarAlt,
} from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL
const API = `${API_URL}/api/private-chat`
const ADMIN_API = `${API_URL}/api/admin`

const socket = io(API_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
})

const UserProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/profile/${id}`, config)

      setProfile(data)
    } catch (error) {
      console.log(error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }, [id, userInfo?.token])

  useEffect(() => {
    fetchProfile()

    const handleProfileUpdated = (data) => {
      if (data?.userId === id) {
        fetchProfile()
      }
    }

    socket.on('profileUpdated', handleProfileUpdated)

    return () => {
      socket.off('profileUpdated', handleProfileUpdated)
    }
  }, [id, fetchProfile])

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

  const removeAssignedData = async (type) => {
    const labels = {
      trainer: 'trainer',
      program: 'program',
      plan: 'pricing plan',
    }

    if (!confirm(`Are you sure you want to remove this ${labels[type]}?`)) {
      return
    }

    try {
      setActionLoading(true)

      await axios.put(
        `${ADMIN_API}/users/${id}/remove-${type}`,
        {},
        config
      )

      await fetchProfile()
    } catch (error) {
      alert(error.response?.data?.message || `Failed to remove ${labels[type]}`)
    } finally {
      setActionLoading(false)
    }
  }

  const trainer = profile?.assignedTrainer
  const program = profile?.selectedProgram || profile?.assignedProgram
  const plan = profile?.selectedPlan || profile?.pricingPlan || profile?.plan
  const isAdmin = userInfo?.isAdmin === true

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
    <div className='min-h-screen bg-black text-white pt-10 pb-20 px-4'>
      <div className='max-w-7xl mx-auto'>

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

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
          <InfoCard icon={<FaUser />} title='Age' value={profile.age || 'N/A'} />
          <InfoCard icon={<FaVenusMars />} title='Gender' value={profile.gender || 'N/A'} />
          <InfoCard icon={<FaPhoneAlt />} title='Phone' value={profile.phone || 'N/A'} />
          <InfoCard icon={<FaCrown />} title='Membership' value={profile.membership || 'Basic'} />
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
          <InfoCard icon={<FaRulerVertical />} title='Height' value={profile.height ? `${profile.height} cm` : 'N/A'} />
          <InfoCard icon={<FaWeight />} title='Weight' value={profile.weight ? `${profile.weight} kg` : 'N/A'} />
          <InfoCard icon={<FaBullseye />} title='Target Weight' value={profile.targetWeight ? `${profile.targetWeight} kg` : 'N/A'} />
          <InfoCard icon={<FaFire />} title='BMI' value={profile.bmi || 'N/A'} />
        </div>

        <div className='grid md:grid-cols-2 gap-5 mb-8'>
          <InfoCard icon={<FaDumbbell />} title='Completed Workouts' value={profile.completedWorkouts || 0} />
          <InfoCard icon={<FaFire />} title='Calories Burned' value={profile.caloriesBurned || 0} />
        </div>

        <div className='grid lg:grid-cols-3 gap-6 mb-8'>
          <DetailCard
            icon={<FaUserTie />}
            title='Assigned Trainer'
            emptyText='No Trainer Assigned'
            hasData={!!trainer}
            onRemove={() => removeAssignedData('trainer')}
            isAdmin={isAdmin}
            actionLoading={actionLoading}
          >
            {trainer && (
              <>
                <DetailRow label='Name' value={trainer.name} />
                <DetailRow label='Email' value={trainer.email} />
                <DetailRow label='Phone' value={trainer.phone} />
                <DetailRow
                  label='Specialization'
                  value={
                    Array.isArray(trainer.specialization)
                      ? trainer.specialization.join(', ')
                      : trainer.specialization
                  }
                />
                <DetailRow label='Experience' value={trainer.experience ? `${trainer.experience} years` : 'N/A'} />
                <DetailRow label='Monthly Fee' value={trainer.monthlyFee ? `₹${trainer.monthlyFee}` : 'N/A'} />
                <DetailRow label='Availability' value={trainer.availability} />
                <DetailRow label='Rating' value={trainer.rating ? `${trainer.rating} ⭐` : 'N/A'} />
              </>
            )}
          </DetailCard>

          <DetailCard
            icon={<FaClipboardList />}
            title='Assigned Program'
            emptyText='No Program Assigned'
            hasData={!!program}
            onRemove={() => removeAssignedData('program')}
            isAdmin={isAdmin}
            actionLoading={actionLoading}
          >
            {program && (
              <>
                <DetailRow label='Title' value={program.title} />
                <DetailRow label='Category' value={program.category} />
                <DetailRow label='Level' value={program.level} />
                <DetailRow label='Duration' value={program.durationWeeks ? `${program.durationWeeks} weeks` : 'N/A'} />
                <DetailRow label='Price' value={program.price ? `₹${program.price}` : 'Free'} />
                <DetailRow label='Premium' value={program.isPremium ? 'Yes' : 'No'} />
                <DetailRow label='Description' value={program.description} />
              </>
            )}
          </DetailCard>

          <DetailCard
            icon={<FaCrown />}
            title='Pricing Plan'
            emptyText='No Pricing Plan Assigned'
            hasData={!!plan || !!profile.membership}
            onRemove={() => removeAssignedData('plan')}
            isAdmin={isAdmin}
            actionLoading={actionLoading}
          >
            {plan ? (
              <>
                <DetailRow label='Title' value={plan.title || plan.name} />
                <DetailRow label='Type' value={plan.type} />
                <DetailRow label='Price' value={plan.price ? `₹${plan.price}` : 'N/A'} />
                <DetailRow label='Duration' value={plan.durationInDays ? `${plan.durationInDays} days` : 'N/A'} />
                <DetailRow label='Trainer Support' value={plan.includesTrainerSupport ? 'Yes' : 'No'} />
                <DetailRow
                  label='Features'
                  value={
                    Array.isArray(plan.features)
                      ? plan.features.join(', ')
                      : plan.features
                  }
                />
              </>
            ) : (
              <DetailRow label='Membership' value={profile.membership || 'Basic'} />
            )}
          </DetailCard>
        </div>

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

const DetailCard = ({
  icon,
  title,
  emptyText,
  hasData,
  children,
  onRemove,
  isAdmin,
  actionLoading,
}) => {
  return (
    <div className='bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-xl'>
      <div className='flex items-start justify-between gap-4 mb-5'>
        <div>
          <div className='text-yellow-500 text-2xl mb-3'>
            {icon}
          </div>

          <h2 className='text-2xl font-bold'>
            {title}
          </h2>
        </div>

        {isAdmin && hasData && (
          <button
            onClick={onRemove}
            disabled={actionLoading}
            className='flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-bold transition'
          >
            <FaTrash />
            Remove
          </button>
        )}
      </div>

      {hasData ? (
        <div className='space-y-3'>
          {children}
        </div>
      ) : (
        <p className='text-gray-400'>
          {emptyText}
        </p>
      )}
    </div>
  )
}

const DetailRow = ({ label, value }) => {
  return (
    <div className='bg-black/40 border border-white/5 rounded-2xl p-4'>
      <p className='text-gray-500 text-xs uppercase tracking-wide mb-1'>
        {label}
      </p>

      <p className='text-white font-semibold break-words'>
        {value || 'N/A'}
      </p>
    </div>
  )
}

export default UserProfile