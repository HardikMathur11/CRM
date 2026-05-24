import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';

// Pages imports
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
        {/* Global Notifications Alert Handler */}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <Routes>
          {/* Public Auth Endpoint */}
          <Route path="/login" element={<Login />} />

          {/* Secure Workspace Portals */}
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

          {/* Admin & Manager Only: Products */}
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <ProductList />
              </ProtectedRoute>
            }
          />

          {/* Admin Only: Team Management */}
          <Route
            path="/team"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TeamOverview />
              </ProtectedRoute>
            }
          />

          {/* Root Redirect handler */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
