import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DashboardHome from './pages/DashboardHome'
import MascotasPage from './pages/MascotasPage'
import ProfesionalesPage from './pages/ProfesionalesPage'
import TiendaPage from './pages/TiendaPage'
import CarritoPage from './pages/CarritoPage'
import MisTurnosPage from './pages/MisTurnosPage'
import TarjetasPage from './pages/TarjetasPage'
import ReservarTurnoPage from './pages/ReservarTurnoPage'
import CompraExitosaPage from './pages/CompraExitosaPage'
import AdminUsuariosPage from './pages/AdminUsuariosPage'
import AdminPostulacionesPage from './pages/AdminPostulacionesPage'
import AdminMascotasPage from './pages/AdminMascotasPage'
import AdminTurnosPage from './pages/AdminTurnosPage'
import AdminProductosPage from './pages/AdminProductosPage'
import AdminReportesPage from './pages/AdminReportesPage'
import ProfesionalDashboard from './pages/ProfesionalDashboard'
import MisTurnosProfesionalPage from './pages/MisTurnosProfesionalPage'
import MisPacientesProfesionalPage from './pages/MisPacientesProfesionalPage'
import PerfilProfesionalPage from './pages/PerfilProfesionalPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="mascotas" element={<MascotasPage />} />
        <Route path="profesionales" element={<ProfesionalesPage />} />
        <Route path="profesionales/reservar/:idProfesional" element={<ReservarTurnoPage />} />
        <Route path="tienda" element={<TiendaPage />} />
        <Route path="carrito" element={<CarritoPage />} />
        <Route path="mis-turnos" element={<MisTurnosPage />} />
        <Route path="tarjetas" element={<TarjetasPage />} />
        <Route path="compra-exitosa" element={<CompraExitosaPage />} />
        <Route path="admin/usuarios" element={<AdminUsuariosPage />} />
        <Route path="admin/postulaciones" element={<AdminPostulacionesPage />} />
        <Route path="admin/mascotas" element={<AdminMascotasPage />} />
        <Route path="admin/turnos" element={<AdminTurnosPage />} />
        <Route path="admin/productos" element={<AdminProductosPage />} />
        <Route path="admin/reportes" element={<AdminReportesPage />} />
        <Route path="profesional" element={<ProfesionalDashboard />} />
        <Route path="profesional/mis-turnos" element={<MisTurnosProfesionalPage />} />
        <Route path="profesional/mis-pacientes" element={<MisPacientesProfesionalPage />} />
        <Route path="profesional/perfil" element={<PerfilProfesionalPage />} />
      </Route>
    </Routes>
  )
}

export default App
