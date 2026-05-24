import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';

// import pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadList from './pages/Leads/LeadList';
import LeadDetail from './pages/Leads/LeadDetail';
import ClientList from './pages/Clients/ClientList';
import ClientDetail from './pages/Clients/ClientDetail';
import FollowUpList from './pages/FollowUps/FollowUpList';
import ProductList from './pages/Products/ProductList';
import TeamOverview from './pages/Team/TeamOverview';
import SalesReport from './pages/Reports/SalesReport';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* toast notifications */}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <Routes>
          {/* public stuff */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* auth protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <LeadList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/:id"
            element={
              <ProtectedRoute>
                <LeadDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <ClientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/:id"
            element={
              <ProtectedRoute>
                <ClientDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/followups"
            element={
              <ProtectedRoute>
                <FollowUpList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <SalesReport />
              </ProtectedRoute>
            }
          />

          {/* anyone can see products catalog */}
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'bda']}>
                <ProductList />
              </ProtectedRoute>
            }
          />

          {/* admin only team panel */}
          <Route
            path="/team"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TeamOverview />
              </ProtectedRoute>
            }
          />

          {/* fallback redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
