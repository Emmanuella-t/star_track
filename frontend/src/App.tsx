import { Navigate, Route, Routes } from 'react-router-dom'
import { AdvisorAppointments } from './pages/AdvisorAppointments'
import { AdvisorAvailability } from './pages/AdvisorAvailability'
import { AdvisorDashboard } from './pages/AdvisorDashboard'
import { DemoPage } from './pages/DemoPage'
import { LandingPage } from './pages/LandingPage'
import { StudentAppointments } from './pages/StudentAppointments'
import { StudentDashboard } from './pages/StudentDashboard'
import { StudentProgress } from './pages/StudentProgress'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/progress" element={<StudentProgress />} />
      <Route path="/student/appointments" element={<StudentAppointments />} />
      <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
      <Route path="/advisor/appointments" element={<AdvisorAppointments />} />
      <Route path="/advisor/availability" element={<AdvisorAvailability />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
