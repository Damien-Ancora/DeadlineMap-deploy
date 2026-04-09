import { Link } from "react-router-dom";

/**
 * Carte centrée pour les formulaires d'authentification.
 *
 * Props :
 *  - title          : titre affiché en haut de la carte
 *  - children       : contenu du formulaire
 *  - footerText     : texte du pied de carte (ex. "Pas encore de compte ?")
 *  - footerLinkText : texte du lien (ex. "S'inscrire")
 *  - footerLinkTo   : destination du lien (ex. "/register")
 */
const FormCard = ({ title, children, footerText, footerLinkText, footerLinkTo }) => {
    return (
        <div className="container mt-5 ">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">{title}</h2>
                            {children}
                            {footerText && (
                                <p className="text-center mt-3 mb-0">
                                    {footerText}{" "}
                                    <Link to={footerLinkTo} className="text-primary">
                                        {footerLinkText}
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormCard;
