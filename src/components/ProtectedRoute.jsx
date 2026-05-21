import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({
  children,
}) => {

  const userInfo = JSON.parse(
    localStorage.getItem('userInfo')
  )

  /* NOT LOGGED IN */

  if (!userInfo || !userInfo.token) {

    return (
      <Navigate
        to='/login'
        replace
      />
    )

  }

  /* USER BANNED */

  if (userInfo.isActive === false) {

    localStorage.removeItem('userInfo')

    return (
      <Navigate
        to='/login'
        replace
      />
    )

  }

  /* ALLOW ACCESS */

  return children
}

export default ProtectedRoute