/**
 * Carte d'étape numérotée (section "Comment ça marche").
 *
 * Props :
 *  - step        : numéro de l'étape
 *  - title       : titre de l'étape
 *  - description : description courte
 */
const StepCard = ({ step, title, description }) => {
    return (
        <div className="col-md-3 text-center">
            <div
                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3 p-3 fs-5"
            >
                {step}
            </div>
            <h6 className="fw-bold">{title}</h6>
            <p className="text-muted small">{description}</p>
        </div>
    );
};

export default StepCard;
