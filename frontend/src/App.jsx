import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import TicketsList from './pages/TicketsList.jsx';
import TicketDetail from './pages/TicketDetail.jsx';
import NewTicket from './pages/NewTicket.jsx';
import BreachedList from './pages/BreachedList.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Signup from './pages/Signup.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Default redirect to tickets */}
        <Route path="/" element={<Navigate to="/tickets" />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute>
              <NewTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/breached"
          element={
            <ProtectedRoute>
              <BreachedList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
