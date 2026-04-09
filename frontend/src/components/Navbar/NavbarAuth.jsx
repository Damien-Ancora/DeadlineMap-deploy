import { Link, NavLink } from "react-router-dom";
import NotificationBell from "./NotificationBell";

// Navbar pour les utilisateurs connectés
const NavbarAuth = ({ username, onLogout }) => (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/dashboard">ICHEC Deadline</Link>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarAuth"
                aria-controls="navbarAuth"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarAuth">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/dashboard">
                            Tableau de Bord
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/deadlines">
                            Mes Deadlines
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/groups">
                            Mes Groupes
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/profile">
                            Mon Profil
                        </NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto align-items-center">
                    <ul className="navbar-nav"> {/* Wrap to align properly */}
                        <NotificationBell />
                    </ul>
                    <li className="nav-item me-2 ms-3">
                        <span className="navbar-text text-white">
                            Bonjour, <strong>{username}</strong>
                        </span>
                    </li>
                    <li className="nav-item">
                        <button className="btn btn-outline-light btn-sm ms-2" onClick={onLogout}>
                            Déconnexion
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);

export default NavbarAuth;
