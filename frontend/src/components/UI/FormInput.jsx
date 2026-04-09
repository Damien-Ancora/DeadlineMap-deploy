/**
 * Champ de formulaire réutilisable (label + input).
 *
 * Props :
 *  - id          : id de l'input (lié au htmlFor du label)
 *  - label       : texte du label
 *  - type        : type de l'input ("text" | "email" | "password" | …)  [défaut : "text"]
 *  - placeholder : placeholder de l'input
 *  - value       : valeur contrôlée
 *  - onChange    : handler de changement
 *  - required    : champ obligatoire  [défaut : false]
 */
const FormInput = ({
    id,
    name,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    pattern,
    title,
    children,
}) => {
    return (
        <div className="mb-3 w-100">
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            {type === 'textarea' ? (
                <textarea
                    className="form-control"
                    id={id}
                    name={name || id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    rows="3"
                ></textarea>
            ) : type === 'select' ? (
                <select
                    className="form-select"
                    id={id}
                    name={name || id}
                    value={value}
                    onChange={onChange}
                    required={required}
                >
                    {children}
                </select>
            ) : (
                <input
                    type={type}
                    className="form-control"
                    id={id}
                    name={name || id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    pattern={pattern}
                    title={title}
                />
            )}
        </div>
    );
};

export default FormInput;
