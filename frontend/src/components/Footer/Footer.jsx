const Footer = () => {
    return (
        <footer className="bg-primary text-white mt-auto py-5" data-bs-theme="dark">
            <div className="container">
                <div className="row g-4">
                    <div className="col-md-4">
                        <h5 className="fw-bold mb-3">ICHEC Deadline</h5>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                    <div className="col-md-4">
                        <h5 className="fw-bold mb-3">Liens utiles</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="/" className="text-white text-decoration-none">Accueil</a></li>
                            <li className="mb-2"><a href="/login" className="text-white text-decoration-none">Connexion</a></li>
                            <li className="mb-2"><a href="/register" className="text-white text-decoration-none">Inscription</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5 className="fw-bold mb-3">Contact</h5>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim
                            ad minim veniam, quis nostrud exercitation ullamco laboris.
                        </p>
                        <p className="mb-0">contact@ichec-deadline.be</p>
                    </div>
                </div>
                <hr className="border-white mt-4" />
                <p className="text-center mb-0">© 2026 ICHEC Deadline. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;
