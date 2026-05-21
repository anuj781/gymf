import { Navigate } from 'react-router-dom'

const AdminRoute = ({
  children,
}) => {

  const userInfo = JSON.parse(
    localStorage.getItem('userInfo')
  )

  /* NOT LOGGED IN */

  if (
    !userInfo ||
    !userInfo.token
  ) {

    return (
      <Navigate
        to='/login'
        replace
      />
    )

  }

  /* BANNED USER */

  if (
    userInfo.isActive === false
  ) {

    localStorage.removeItem(
      'userInfo'
    )

    return (
      <Navigate
        to='/login'
        replace
      />
    )

  }

  /* NOT ADMIN */

  if (!userInfo.isAdmin) {

    return (
      <Navigate
        to='/dashboard'
        replace
      />
    )

  }

  /* ALLOW ACCESS */

  return children
}

export default AdminRoute