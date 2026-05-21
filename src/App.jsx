import {
  Routes,
  Route,
} from 'react-router-dom'

import MainLayout from './layouts/MainLayout'

import Home from './pages/Home'
import About from './pages/About'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'

import Login from './pages/Login'
import Signup from './pages/Signup'

import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'

import Chat from './pages/Chat'
import SearchUsers from './pages/SearchUsers'
import UserProfile from './pages/UserProfile'
import Inbox from './pages/Inbox'
import PrivateChat from './pages/PrivateChat'

import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>

        <Route index element={<Home />} />

        <Route path='about' element={<About />} />

        <Route path='pricing' element={<Pricing />} />

        <Route path='contact' element={<Contact />} />

        <Route
          path='chat'
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path='chat/:conversationId'
          element={
            <ProtectedRoute>
              <PrivateChat />
            </ProtectedRoute>
          }
        />

        <Route
          path='search-users'
          element={
            <ProtectedRoute>
              <SearchUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path='profile/:id'
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path='inbox'
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />

        <Route
          path='dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path='admin'
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

      </Route>

      <Route path='/login' element={<Login />} />

      <Route path='/signup' element={<Signup />} />

    </Routes>
  )
}

export default App