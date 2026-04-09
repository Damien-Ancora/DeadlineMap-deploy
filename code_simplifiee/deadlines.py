from datetime import date
from users import User
from groups import Group

class Deadline:
    def __init__(self, deadline_id: int, name: str, due_date: date, start_date: date = None,
                 description: str = "", priority: str = "medium",
                 user: User = None, group: Group = None, creator: User = None):
        
        self.check_owner_constraint(user, group)
        
        self._id = deadline_id
        self._name = name
        self._description = description
        self._priority = priority
        self._status = "pending"
        self._start_date = start_date
        self._due_date = due_date
        self._user = user
        self._group = group
        self._creator = creator or user # Le créateur est celui qui crée, utile pour les logs
        
        # Liaison Inverse de Donnée (POO) pour remplacer la requête BDD
        if self._user:
            self._user.add_deadline(self)
        if self._group:
            self._group.add_deadline(self)
            
        print(f"[DB_SAVE] Création de la deadline '{self._name}' réussie.")

    def check_owner_constraint(self, user, group):
        """Mime la logique 'deadline_exactly_one_owner_ck'"""
        if (user and group) or (not user and not group):
            raise ValueError("[DatabaseError] Une deadline doit appartenir soit à un User, soit à un Group (pas les 2).")

    # --- GETTERS ---
    def get_name(self) -> str:
        return self._name

    def get_status(self) -> str:
        return self._status

    def get_due_date(self) -> date:
        return self._due_date

    # --- SETTERS ---
    def set_name(self, name: str):
        self._name = name

    def set_description(self, description: str):
        self._description = description

    def set_priority(self, priority: str):
        if priority in ["low", "medium", "high"]:
            self._priority = priority

    def set_status(self, status: str):
        if status in ["pending", "in_progress", "completed"]:
            self._status = status
            print(f"[UPDATE] La deadline '{self._name}' passe au statut : {self._status}.")

    def delete(self):
        """Mime ORM delete()"""
        print(f"[DB_DELETE] Deadline '{self._name}' retirée des index.")
        
        # Rompre la liaison pour simuler ON DELETE CASCADE ou nettoyage memoire
        if self._group:
            self._group.remove_deadline(self)

    def __str__(self):
        return f"{self._name} (due: {self._due_date})"

    def __del__(self):
        print(f"[DB_DELETE] L'objet Deadline '{self._name}' a été détruit en mémoire (destructeur).")