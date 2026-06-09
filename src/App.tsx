import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { paths } from '@/router/paths'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ColisPage } from '@/pages/ColisPage'
import { ColisDetailPage } from '@/pages/ColisDetailPage'
import { NouveauColisPage } from '@/pages/NouveauColisPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { ItinerairesPage } from '@/pages/ItinerairesPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { RapportsPage } from '@/pages/RapportsPage'
import { ParametresPage } from '@/pages/ParametresPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <Routes>
      {/* Route publique */}
      <Route path={paths.login} element={<LoginPage />} />

      {/* Routes protégées dans la coquille applicative */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={paths.dashboard} element={<DashboardPage />} />
          <Route path={paths.colis} element={<ColisPage />} />
          <Route path={paths.colisNouveau} element={<NouveauColisPage />} />
          <Route path={paths.colisDetail()} element={<ColisDetailPage />} />
          <Route path={paths.clients} element={<ClientsPage />} />
          <Route path={paths.itineraires} element={<ItinerairesPage />} />
          <Route path={paths.notifications} element={<NotificationsPage />} />
          <Route path={paths.rapports} element={<RapportsPage />} />
          <Route path={paths.parametres} element={<ParametresPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
