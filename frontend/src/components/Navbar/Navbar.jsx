import { Link } from "react-router-dom";

// Navbar pour les utilisateurs NON connectés
const NavbarGuest = () => (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">ICHEC Deadline</Link>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarGuest"
                aria-controls="navbarGuest"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarGuest">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link className="nav-link active" to="/">
                            Accueil <span className="visually-hidden">(current)</span>
                        </Link>
                    </li>
                </ul>
                <div className="d-flex gap-2">
                    <Link to="/login" className="btn btn-outline-light">
                        Connexion
                    </Link>
                    <Link to="/register" className="btn btn-secondary">
                        Inscription
                    </Link>
                </div>
            </div>
        </div>
    </nav>
);

export default NavbarGuest;
