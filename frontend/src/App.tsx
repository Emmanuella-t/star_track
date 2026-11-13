import { Navigate, Route, Routes } from 'react-router-dom'
import { AdvisorDashboard } from './pages/AdvisorDashboard'
import { DemoPage } from './pages/DemoPage'
import { LandingPage } from './pages/LandingPage'
import { StudentDashboard } from './pages/StudentDashboard'
import { StudentProgress } from './pages/StudentProgress'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/progress" element={<StudentProgress />} />
      <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
