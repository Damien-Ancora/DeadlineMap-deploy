import { Link } from "react-router-dom";

/**
 * Button réutilisable.
 *
 * Props :
 *  - children   : contenu du bouton
 *  - variant    : variante Bootstrap (ex. "primary", "outline-light", "secondary", "light", "danger")  [défaut : "primary"]
 *  - size       : taille Bootstrap ("sm" | "lg")  [optionnel]
 *  - fullWidth  : true → wrap dans <div className="d-grid">  [défaut : false]
 *  - to         : si renseigné, rend un <Link> react-router au lieu d'un <button>
 *  - type       : type HTML du bouton ("button" | "submit" | "reset")  [défaut : "button"]
 *  - onClick    : handler de clic
 *  - className  : classes CSS supplémentaires
 *  - disabled   : désactiver le bouton
 */
const Button = ({
    children,
    variant = "primary",
    size,
    fullWidth = false,
    to,
    type = "button",
    onClick,
    className = "",
    disabled = false,
}) => {
    const classes = [
        "btn",
        `btn-${variant}`,
        size ? `btn-${size}` : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const element = to ? (
        <Link to={to} className={classes}>
            {children}
        </Link>
    ) : (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );

    return fullWidth ? <div className="d-grid mt-4">{element}</div> : element;
};

export default Button;
