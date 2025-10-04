import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <h1>HelpDesk Mini</h1>
      {user ? (
        <div>
          <span>Welcome, {user.name || 'User'}</span>
          <button onClick={logout} style={{ marginLeft: '1rem' }}>Logout</button>
        </div>
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  );
}
