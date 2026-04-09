const Header = ({ urlLogo, children }) => {
    return (
        <header className="d-flex align-items-center gap-3 p-3">
            <img src={urlLogo} alt="logo" height="40" className="w-auto" />
            <div>{children}</div>
        </header>
    );
};

export default Header;
