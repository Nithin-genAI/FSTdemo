import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import '../../App.css'

function AppFrame() {
  return (
    <div className="app-frame">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default AppFrame
