from users import User

class Group:
    def __init__(self, group_id: int, name: str):
        self._id = group_id
        self._name = name
        self._memberships = [] # Liste de GroupUser
        self._deadlines = [] # Liste des Deadlines gérées par le groupe

    # --- GETTERS ---
    def get_id(self) -> int:
        return self._id

    def get_name(self) -> str:
        return self._name

    def get_memberships(self) -> list:
        return self._memberships

    def get_deadlines(self) -> list:
        return self._deadlines

    # --- SETTERS ET ASSOCIATIONS ---
    def set_name(self, name: str):
        self._name = name

    def add_deadline(self, deadline):
        self._deadlines.append(deadline)

    def remove_deadline(self, deadline):
        if deadline in self._deadlines:
            self._deadlines.remove(deadline)

    # --- MÉTHODES MÉTIER ---
    def add_member(self, user: User, is_admin: bool = False):
        for membership in self._memberships:
            if membership.get_user() == user:
                print(f"[INFO] {user.get_first_name()} est déjà dans le groupe.")
                return

        new_membership = GroupUser(self, user, is_admin)
        self._memberships.append(new_membership)
        
        # Liaison Inverse pour l'utilisateur
        user.add_group_membership(new_membership)
        
        print(f"[DB_SAVE] '{user.get_first_name()}' a rejoint '{self._name}' (Admin: {is_admin}).")

    def remove_member(self, admin_user: User, target_user: User):
        """Mime la vérification des permissions et la suppression d'un membre."""
        # Vérifier si admin_user est admin
        is_admin = False
        for membership in self._memberships:
            if membership.get_user() == admin_user and membership.is_admin():
                is_admin = True
                break
        
        if not is_admin:
            print(f"[PERMISSION DENIED] {admin_user.get_first_name()} n'est pas admin de '{self._name}'.")
            return
            
        for membership in self._memberships:
            if membership.get_user() == target_user:
                self._memberships.remove(membership)
                target_user.remove_group_membership(membership)
                print(f"[DB_DELETE] '{target_user.get_first_name()}' a été retiré du groupe '{self._name}'.")
                return
                
        print(f"[INFO] '{target_user.get_first_name()}' n'est pas dans le groupe.")

    def __str__(self):
        return self._name

class GroupUser:
    """Représente la table intermédiaire GroupUser"""
    def __init__(self, group: Group, user: User, is_admin: bool = False):
        self._group = group
        self._user = user
        self._is_admin = is_admin

    # --- GETTERS ---
    def get_group(self) -> Group:
        return self._group

    def get_user(self) -> User:
        return self._user

    def is_admin(self) -> bool:
        return self._is_admin

    # --- SETTERS ---
    def set_is_admin(self, is_admin: bool):
        self._is_admin = is_admin
        print(f"[UPDATE] Droits d'admin modifiés pour {self._user.get_first_name()}.")