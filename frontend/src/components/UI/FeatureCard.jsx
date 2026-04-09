/**
 * Carte de fonctionnalité (icône + titre + description).
 *
 * Props :
 *  - icon        : emoji ou élément représentant l'icône
 *  - title       : titre de la fonctionnalité
 *  - description : description textuelle
 */
const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
                <div className="card-body p-4">
                    <div className="fs-2 mb-3">{icon}</div>
                    <h5 className="card-title fw-bold">{title}</h5>
                    <p className="card-text text-muted">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default FeatureCard;
