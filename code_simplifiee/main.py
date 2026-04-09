# main.py
# Simulation Console Orientée Objet Pédagogique
from datetime import datetime
from users import User
from groups import Group
from deadlines import Deadline


users = []
groups = []
deadlines = []

group_counter = 1
deadline_counter = 1
current_user = None

def find_user_by_email(email):
    print(f"[SIMULATION BDD] Recherche de l'utilisateur avec l'email '{email}'...")
    for u in users:
        if u.get_email() == email:
            return u
    return None

def parse_date(date_str):
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        print("[ERREUR] Format de date invalide. Ignorée.")
        return None

def main():
    global current_user
    while True:
        print("\n=== ACCUEIL - DEADLINEMAP ===")
        print("1. S'inscrire")
        print("2. Se connecter")
        print("3. Quitter")
        choice = input("Choisissez une option: ")

        if choice == '1':
            first_name = input("Prénom: ")
            last_name = input("Nom: ")
            email = input("Email: ")
            
            if find_user_by_email(email):
                print("Cet email existe déjà.")
                continue
                
            password = input("Mot de passe: ")
            
            # Application POO
            user_id = len(users) + 1
            user = User(user_id, first_name, last_name, email, role="student")
            user.set_password(password) # Affiche un print de hachage (Simulation Complexe)
            users.append(user)
            
            print(f"\n[SUCCÈS] Inscription réussie pour {first_name}!")

        elif choice == '2':
            email = input("Email: ")
            password = input("Mot de passe: ")
            user = find_user_by_email(email)
            
            if user and user.check_password(password):
                current_user = user
                print(f"[SUCCÈS] Bonjour, {current_user.get_first_name()}!")
                dashboard_menu()
            else:
                print("[ERREUR] Identifiants incorrects.")

        elif choice == '3':
            print("Au revoir!")
            break

def dashboard_menu():
    global current_user
    while current_user:
        print(f"\n=== MENU PRINCIPAL - {current_user.get_first_name()} ===")
        print("1. Gérer mes Groupes")
        print("2. Gérer mes Deadlines")
        print("3. Déconnexion")
        
        c = input("Option: ")
        
        if c == '1':
            group_menu()
        elif c == '2':
            deadline_menu()
        elif c == '3':
            current_user = None

def group_menu():
    global group_counter
    print("\n--- MES GROUPES ---")
    mes_groupes = current_user.get_my_groups()
    print("1. Voir mes groupes")
    print("2. Créer un groupe")
    print("3. Ajouter un membre")
    print("4. Retirer un membre (Admin)")
    print("0. Retour")
    
    gc = input("Action: ")
    if gc == '1':
        for idx, g in enumerate(mes_groupes):
            print(f"{idx+1}. {g.get_name()}")
    elif gc == '2':
        nom = input("Nom du groupe: ")
        if not nom:
            print("[ERREUR] Le nom du groupe est obligatoire.")
            return

        new_g = Group(group_counter, nom)
        group_counter += 1
        
        print("[SIMULATION] Logique de droits: Le créateur devient Admin du groupe automatiquement.")
        new_g.add_member(current_user, is_admin=True) 
        groups.append(new_g)
        
    elif gc == '3':
        if not mes_groupes:
            print("[ERREUR] Vous n'avez aucun groupe.")
            return

        for idx, g in enumerate(mes_groupes): print(f"{idx+1}. {g.get_name()}")
        c = input("Numéro du groupe: ")
        if c.isdigit() and 1 <= int(c) <= len(mes_groupes):
            gr = mes_groupes[int(c)-1]
            e = input("Email de l'utilisateur à ajouter: ")
            u = find_user_by_email(e)
            if u:
                gr.add_member(u, is_admin=False)
            else:
                print("[ERREUR] Utilisateur non trouvé.")
        else:
            print("[ERREUR] Numéro de groupe invalide.")
    elif gc == '4':
        if not mes_groupes:
            print("[ERREUR] Vous n'avez aucun groupe.")
            return

        for idx, g in enumerate(mes_groupes): print(f"{idx+1}. {g.get_name()}")
        c = input("Numéro du groupe: ")
        if c.isdigit() and 1 <= int(c) <= len(mes_groupes):
            gr = mes_groupes[int(c)-1]
            e = input("Email de l'utilisateur à retirer: ")
            u = find_user_by_email(e)
            if u:
                print("[SIMULATION] Vérification des permissions par l'ORM simulé...")
                gr.remove_member(admin_user=current_user, target_user=u)
            else:
                print("[ERREUR] Utilisateur non trouvé.")
        else:
            print("[ERREUR] Numéro de groupe invalide.")

def deadline_menu():
    global deadline_counter
    print("\n--- MES DEADLINES ---")
    mes_dl = current_user.get_my_deadlines()
    print("1. Voir mes deadlines")
    print("2. Créer une deadline (Personnel ou Groupe)")
    print("3. Modifier une deadline")
    print("4. Supprimer une deadline")
    print("0. Retour")
    
    dc = input("Action: ")
    if dc == '1':
        # Pas de filtre complexe, on affiche toutes les deadlines de l'utilisateur
        for idx, d in enumerate(mes_dl):
            ctx = d._group.get_name() if getattr(d, '_group', None) else "Perso"
            sd = f" du {d._start_date.strftime('%Y-%m-%d')}" if d._start_date else ""
            print(f"{idx+1}. [{ctx}] {d.get_name()} (Statut: {d.get_status()} | Priorité: {d._priority}) - Échéance: {d.get_due_date()}{sd}")
            if getattr(d, '_description', None):
                print(f"       -> {d._description}")
                
    elif dc == '2':
        print("\n-- NOUVELLE DEADLINE --")
        nom = input("Titre de la deadline (obligatoire): ")
        desc = input("Description (facultatif): ")
        prio = input("Priorité (low, medium, high) [medium]: ") or "medium"
        
        due_date_str = ""
        while not due_date_str:
            due_date_str = input("Date d'échéance (obligatoire, YYYY-MM-DD): ")
        due_date = parse_date(due_date_str) or datetime.today().date()
        
        start_date_str = input("Date de début (facultatif, YYYY-MM-DD): ")
        start_date = parse_date(start_date_str) if start_date_str else None
        
        ctx = input("Contexte (1=Personnel, 2=Pour un Groupe): ")
        if ctx == '1':
            d = Deadline(deadline_counter, nom, due_date, start_date=start_date, description=desc, priority=prio, user=current_user, creator=current_user)
            deadlines.append(d)
            deadline_counter += 1
            print("[SUCCÈS] Deadline personnelle créée.")
            
        elif ctx == '2':
            mes_g = current_user.get_my_groups()
            if not mes_g:
                print("[ERREUR] Vous n'appartenez à aucun groupe.")
                return
            for idx, g in enumerate(mes_g): print(f"{idx+1}. {g.get_name()}")
            cg = input("Pour quel groupe ?: ")
            if cg.isdigit() and 1 <= int(cg) <= len(mes_g):
                gr = mes_g[int(cg)-1]
                print("[SIMULATION] Création d'une deadline liée à un groupe...")
                d = Deadline(deadline_counter, nom, due_date, start_date=start_date, description=desc, priority=prio, group=gr, creator=current_user)
                deadlines.append(d)
                deadline_counter += 1
                
    elif dc == '3':
        for idx, d in enumerate(mes_dl): print(f"{idx+1}. {d.get_name()}")
        c = input("Numéro de la deadline à modifier: ")
        if c.isdigit() and 1 <= int(c) <= len(mes_dl):
            dl = mes_dl[int(c)-1]
            n_name = input(f"Nouveau titre ({dl.get_name()}): ") or dl.get_name()
            dl.set_name(n_name)
            
            n_desc = input(f"Nouvelle description ({dl._description}): ")
            if n_desc: dl.set_description(n_desc)
            
            s = input(f"Nouveau statut ({dl.get_status()}) [pending, in_progress, completed]: ")
            if s: dl.set_status(s)
            
            p = input(f"Nouvelle priorité ({dl._priority}) [low, medium, high]: ")
            if p: dl.set_priority(p)
            
    elif dc == '4':
        for idx, d in enumerate(mes_dl): print(f"{idx+1}. {d.get_name()}")
        c = input("Numéro de la deadline à supprimer: ")
        if c.isdigit() and 1 <= int(c) <= len(mes_dl):
            dl = mes_dl[int(c)-1]
            print("[SIMULATION BDD] Lancement du processus de suppression... Déclenchement signal pré-suppression.")
            dl.delete()
            deadlines.remove(dl)
            del dl

if __name__ == "__main__":
    main()
