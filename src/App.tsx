import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { paths } from '@/router/paths'
import { LoginPage } from '@/pages/LoginPage'
import { InscriptionPage } from '@/pages/InscriptionPage'
import { SuiviPage } from '@/pages/SuiviPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ScanPage } from '@/pages/ScanPage'
import { ColisPage } from '@/pages/ColisPage'
import { ColisDetailPage } from '@/pages/ColisDetailPage'
import { NouveauColisPage } from '@/pages/NouveauColisPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { AgencesPage } from '@/pages/AgencesPage'
import { UtilisateursPage } from '@/pages/UtilisateursPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { RapportsPage } from '@/pages/RapportsPage'
import { ParametresPage } from '@/pages/ParametresPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path={paths.login} element={<LoginPage />} />
      <Route path={paths.inscription} element={<InscriptionPage />} />
      <Route path={paths.suivi()} element={<SuiviPage />} />
      <Route path="/suivi" element={<SuiviPage />} />

      {/* Routes protégées dans la coquille applicative */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={paths.dashboard} element={<DashboardPage />} />
          <Route path={paths.scan} element={<ScanPage />} />
          <Route path={paths.colis} element={<ColisPage />} />
          <Route path={paths.colisNouveau} element={<NouveauColisPage />} />
          <Route path={paths.colisDetail()} element={<ColisDetailPage />} />
          <Route path={paths.clients} element={<ClientsPage />} />
          <Route path={paths.agences} element={<AgencesPage />} />
          <Route path={paths.utilisateurs} element={<UtilisateursPage />} />
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
