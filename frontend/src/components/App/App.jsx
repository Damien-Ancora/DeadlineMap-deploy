import { Outlet, useNavigate } from 'react-router-dom';
import '../../styles/bootstrap.css'
import Footer from '../Footer/Footer';
import NavbarGuest from '../Navbar/Navbar';
import NavbarAuth from '../Navbar/NavbarAuth';
import { useAuth } from '../../auth/AuthProvider';

function App() {
  const auth = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {auth && auth.user
        ? <NavbarAuth username={auth.user.first_name || auth.user.username} onLogout={handleLogout} />
        : <NavbarGuest />
      }

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
