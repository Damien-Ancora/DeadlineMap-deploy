class User:
    def __init__(self, user_id: int, first_name: str, last_name: str, email: str, role: str = "student"):
        self._id = user_id
        self._first_name = first_name
        self._last_name = last_name
        self._email = email
        self._role = role
        self._password_hash = None
        
        # Navigation Inverse (POO) pour remplacer les listes globales
        self._deadlines = []
        self._group_memberships = []

    # --- GETTERS DE NAVIGATION INVERSE ---
    def get_my_deadlines(self) -> list:
        # On retourne ses propores deadlines + celles de ses groupes
        all_dl = list(self._deadlines)
        for membership in self._group_memberships:
            group = membership.get_group()
            # On ajoute les deadlines du groupe si elles ne sont pas déjà persos (normalement impossible vu la contrainte)
            all_dl.extend(group.get_deadlines())
        return all_dl

    def get_my_groups(self) -> list:
        # On retourne les objets Group depuis les GroupUser
        return [membership.get_group() for membership in self._group_memberships]

    def add_deadline(self, deadline):
        self._deadlines.append(deadline)

    def remove_deadline(self, deadline):
        if deadline in self._deadlines:
            self._deadlines.remove(deadline)

    def add_group_membership(self, group_user):
        self._group_memberships.append(group_user)

    def remove_group_membership(self, group_user):
        if group_user in self._group_memberships:
            self._group_memberships.remove(group_user)

    def get_first_name(self) -> str:
        return self._first_name

    def get_last_name(self) -> str:
        return self._last_name

    def get_email(self) -> str:
        return self._email

    def get_role(self) -> str:
        return self._role

    # --- SETTERS ---
    def set_first_name(self, first_name: str):
        self._first_name = first_name

    def set_last_name(self, last_name: str):
        self._last_name = last_name

    def set_email(self, email: str):
        self._email = email

    def set_role(self, role: str):
        allowed_roles = ["student", "admin"]
        if role in allowed_roles:
            self._role = role
        else:
            print("[ERREUR] Rôle non valide.")

    # --- MÉTHODES MÉTIER ---
    def set_password(self, raw_password: str):
        """Mime 'set_password' (make_password) de Django."""
        print(f"[PROCESSUS] Hachage du mot de passe pour {self._email}...")
        self._password_hash = f"hashed_{raw_password}_123"
        print("[SUCCÈS] Mot de passe encryté et enregistré.")

    def check_password(self, raw_password: str) -> bool:
        """Mime 'check_password' de Django."""
        print(f"[PROCESSUS] Vérification du mot de passe pour {self._email}...")
        expected_hash = f"hashed_{raw_password}_123"
        
        if self._password_hash == expected_hash:
            print("[SUCCÈS] Connexion autorisée.")
            return True
        else:
            print("[ERREUR] Mot de passe incorrect.")
            return False

    def __str__(self):
        return f"{self._first_name} {self._last_name} ({self._email})"