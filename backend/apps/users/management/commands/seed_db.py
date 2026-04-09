from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.deadlines.models import Deadline
from apps.groups.models import Group, GroupUser
from apps.notifications.models import Notification, NotificationUser
from apps.users.models import User

USERS_DATA = [
    {
        "username": "alice.dupont",
        "first_name": "Alice",
        "last_name": "Dupont",
        "email": "alice.dupont@student.ichec.be",
        "password": "Alice2026!",
        "role": "student",
    },
    {
        "username": "bob.martin",
        "first_name": "Bob",
        "last_name": "Martin",
        "email": "bob.martin@student.ichec.be",
        "password": "Bob2026!",
        "role": "student",
    },
    {
        "username": "clara.leroy",
        "first_name": "Clara",
        "last_name": "Leroy",
        "email": "clara.leroy@student.ichec.be",
        "password": "Clara2026!",
        "role": "student",
    },
    {
        "username": "david.kahn",
        "first_name": "David",
        "last_name": "Kahn",
        "email": "david.kahn@student.ichec.be",
        "password": "David2026!",
        "role": "student",
    },
    {
        "username": "emma.petit",
        "first_name": "Emma",
        "last_name": "Petit",
        "email": "emma.petit@student.ichec.be",
        "password": "Emma2026!",
        "role": "student",
    },
]

GROUPS_DATA = [
    {
        "slug": "marketing",
        "name": "Projet Marketing",
        "admin": "alice.dupont",
        "members": ["bob.martin", "emma.petit"],
    },
    {
        "slug": "finance",
        "name": "Analyse Financiere",
        "admin": "bob.martin",
        "members": ["clara.leroy", "david.kahn"],
    },
    {
        "slug": "strategie",
        "name": "Strategie d'entreprise",
        "admin": "clara.leroy",
        "members": ["alice.dupont", "bob.martin", "emma.petit"],
    },
    {
        "slug": "hackathon",
        "name": "Hackathon 2026",
        "admin": "david.kahn",
        "members": ["alice.dupont", "bob.martin", "clara.leroy", "emma.petit"],
    },
    {
        "slug": "dataclub",
        "name": "Data Club",
        "admin": "emma.petit",
        "members": ["alice.dupont", "david.kahn"],
    },
]

PERSONAL_DEADLINES = {
    "alice.dupont": [
        {"name": "Rapport de stage", "priority": "high", "status": "in_progress", "start_offset": -12, "due_offset": 4, "description": "Finaliser les sections resultat et conclusion."},
        {"name": "Inscription Master", "priority": "low", "status": "pending", "start_offset": 1, "due_offset": 25, "description": "Completer le dossier administratif en ligne."},
        {"name": "Lecture macro", "priority": "low", "status": "completed", "start_offset": -20, "due_offset": -10, "description": "Terminer les chapitres 3 a 5."},
        {"name": "Preparation oral marketing", "priority": "medium", "status": "pending", "start_offset": -2, "due_offset": 3, "description": "Repetition de la presentation de groupe."},
        {"name": "Budget mensuel perso", "priority": "medium", "status": "pending", "start_offset": 0, "due_offset": 7, "description": "Mettre a jour le tableau de depenses."},
    ],
    "bob.martin": [
        {"name": "Quiz comptabilite", "priority": "medium", "status": "completed", "start_offset": -9, "due_offset": -3, "description": "Quiz Moodle chapitre 6."},
        {"name": "Presentation droit", "priority": "high", "status": "in_progress", "start_offset": -8, "due_offset": 2, "description": "Finaliser les slides et cas pratiques."},
        {"name": "Declaration fiscale simulation", "priority": "high", "status": "pending", "start_offset": 1, "due_offset": 9, "description": "Exercice de fiscalite appliquee."},
        {"name": "Paiement loyer", "priority": "high", "status": "pending", "start_offset": 3, "due_offset": 12, "description": "Programmer le virement bancaire."},
        {"name": "Revision econometrie", "priority": "medium", "status": "pending", "start_offset": -1, "due_offset": 3, "description": "Refaire les exercices de regression."},
    ],
    "clara.leroy": [
        {"name": "Cas pratique fiscalite", "priority": "high", "status": "completed", "start_offset": -18, "due_offset": -7, "description": "Rendu corrige sur le cas Dubois."},
        {"name": "Resume gestion", "priority": "medium", "status": "pending", "start_offset": -1, "due_offset": 6, "description": "Synthese du cours de management."},
        {"name": "Rendez-vous conseiller", "priority": "low", "status": "pending", "start_offset": 0, "due_offset": 1, "description": "Point orientation en bureau 4B."},
        {"name": "Preparation examen strategie", "priority": "high", "status": "in_progress", "start_offset": -6, "due_offset": 5, "description": "Fiches de revision et annales."},
        {"name": "Lecture Harvard Business Review", "priority": "low", "status": "pending", "start_offset": 2, "due_offset": 14, "description": "Selection de 3 articles a presenter."},
    ],
    "david.kahn": [
        {"name": "Projet perso React", "priority": "high", "status": "in_progress", "start_offset": -14, "due_offset": 6, "description": "Terminer le dashboard analytics."},
        {"name": "Revision stats", "priority": "medium", "status": "pending", "start_offset": -2, "due_offset": 3, "description": "Lois normales et intervalles de confiance."},
        {"name": "Certificat medical", "priority": "low", "status": "pending", "start_offset": -8, "due_offset": -1, "description": "Document en retard a remettre."},
        {"name": "Support pitch technique", "priority": "high", "status": "pending", "start_offset": 0, "due_offset": 8, "description": "Documenter l'architecture du MVP."},
        {"name": "Refactor module notifications", "priority": "medium", "status": "completed", "start_offset": -16, "due_offset": -5, "description": "Nettoyage du flux SSE et tests."},
    ],
    "emma.petit": [
        {"name": "Portfolio design", "priority": "high", "status": "in_progress", "start_offset": -10, "due_offset": 15, "description": "Mise a jour Behance et dribbble."},
        {"name": "Candidature stage", "priority": "high", "status": "pending", "start_offset": -1, "due_offset": 4, "description": "Envoyer CV et lettre a 5 entreprises."},
        {"name": "Billets train", "priority": "low", "status": "completed", "start_offset": -7, "due_offset": -2, "description": "Trajet Bruxelles-Paris reserve."},
        {"name": "Moodboard campagne", "priority": "medium", "status": "pending", "start_offset": 1, "due_offset": 10, "description": "Direction artistique pour la campagne."},
        {"name": "Atelier UX research", "priority": "medium", "status": "pending", "start_offset": 2, "due_offset": 3, "description": "Preparation interview utilisateurs."},
    ],
}

GROUP_DEADLINES = {
    "marketing": [
        {"name": "Analyse SWOT", "priority": "high", "status": "completed", "start_offset": -15, "due_offset": -2, "description": "Document final valide par l'equipe."},
        {"name": "Plan de communication", "priority": "medium", "status": "in_progress", "start_offset": -6, "due_offset": 7, "description": "Definir canaux, messages et budget."},
        {"name": "Presentation finale", "priority": "high", "status": "pending", "start_offset": 3, "due_offset": 14, "description": "Oral de cloture devant le jury."},
        {"name": "Benchmark concurrentiel", "priority": "medium", "status": "pending", "start_offset": -1, "due_offset": 3, "description": "Comparer 6 acteurs du marche."},
    ],
    "finance": [
        {"name": "Modele DCF", "priority": "high", "status": "pending", "start_offset": 0, "due_offset": 3, "description": "Scenario central, pessimiste, optimiste."},
        {"name": "Rapport Apple Inc", "priority": "medium", "status": "in_progress", "start_offset": -8, "due_offset": 9, "description": "Rapport financier de 10 pages."},
        {"name": "Tableau de bord KPI", "priority": "medium", "status": "pending", "start_offset": 1, "due_offset": 12, "description": "Suivi des ratios de performance."},
        {"name": "Synthese risque credit", "priority": "low", "status": "completed", "start_offset": -18, "due_offset": -6, "description": "Note interne validee."},
    ],
    "strategie": [
        {"name": "Business plan", "priority": "high", "status": "in_progress", "start_offset": -9, "due_offset": 6, "description": "Version quasi finale du dossier."},
        {"name": "Revue de presse", "priority": "low", "status": "pending", "start_offset": 0, "due_offset": 2, "description": "Selection hebdomadaire de sources clefs."},
        {"name": "Pitch deck", "priority": "high", "status": "pending", "start_offset": 4, "due_offset": 13, "description": "15 slides max, storytelling impactant."},
        {"name": "Analyse PESTEL", "priority": "medium", "status": "completed", "start_offset": -16, "due_offset": -4, "description": "Matrice finalisee et relue."},
    ],
    "hackathon": [
        {"name": "Inscription equipe", "priority": "high", "status": "completed", "start_offset": -12, "due_offset": -8, "description": "Inscription DevPost finalisee."},
        {"name": "Maquette UI/UX", "priority": "high", "status": "in_progress", "start_offset": -5, "due_offset": 3, "description": "Ecran mobile + desktop sur Figma."},
        {"name": "Deploiement MVP", "priority": "high", "status": "pending", "start_offset": 3, "due_offset": 10, "description": "Pipeline CI/CD et monitoring."},
        {"name": "Video demo", "priority": "medium", "status": "pending", "start_offset": 5, "due_offset": 11, "description": "Demo de 2 minutes pour le jury."},
    ],
    "dataclub": [
        {"name": "Dataset cleaning", "priority": "medium", "status": "in_progress", "start_offset": -4, "due_offset": 5, "description": "Nettoyage des valeurs aberrantes et NA."},
        {"name": "Notebook EDA", "priority": "high", "status": "pending", "start_offset": 0, "due_offset": 3, "description": "Analyses descriptives et visualisations."},
        {"name": "Modele baseline", "priority": "high", "status": "pending", "start_offset": 2, "due_offset": 8, "description": "Version baseline du modele de prediction."},
        {"name": "Documentation projet", "priority": "low", "status": "completed", "start_offset": -14, "due_offset": -5, "description": "README technique et guide d'installation."},
    ],
}


class Command(BaseCommand):
    help = "Seed the database with rich dummy data while keeping exactly 5 test accounts."

    @staticmethod
    def _dt(offset_days):
        return date.today() + timedelta(days=offset_days)

    def _create_deadline(self, *, owner_user=None, owner_group=None, data):
        start_date = self._dt(data["start_offset"])
        due_date = self._dt(data["due_offset"])
        if start_date > due_date:
            raise ValueError(f"Invalid date range for deadline '{data['name']}'")

        Deadline.objects.create(
            name=data["name"],
            priority=data["priority"],
            description=data["description"],
            status=data["status"],
            start_date=start_date,
            due_date=due_date,
            user=owner_user,
            group=owner_group,
        )

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write("Nettoyage des donnees existantes...")

        NotificationUser.objects.all().delete()
        Notification.objects.all().delete()
        Deadline.objects.all().delete()
        GroupUser.objects.all().delete()
        Group.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        self.stdout.write("Creation des 5 utilisateurs de test...")
        users = {}
        for data in USERS_DATA:
            user = User(
                username=data["username"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                email=data["email"],
                role=data["role"],
            )
            user.set_password(data["password"])
            user.save()
            users[data["username"]] = user

        self.stdout.write("Creation des groupes et memberships...")
        groups = {}
        for group_data in GROUPS_DATA:
            group = Group.objects.create(name=group_data["name"])
            groups[group_data["slug"]] = group

            GroupUser.objects.create(
                group=group,
                user=users[group_data["admin"]],
                is_admin=True,
            )

            for username in group_data["members"]:
                GroupUser.objects.create(
                    group=group,
                    user=users[username],
                    is_admin=False,
                )

        self.stdout.write("Creation des deadlines personnelles...")
        for username, deadlines in PERSONAL_DEADLINES.items():
            for deadline_data in deadlines:
                self._create_deadline(owner_user=users[username], data=deadline_data)

        self.stdout.write("Creation des deadlines de groupe...")
        for group_slug, deadlines in GROUP_DEADLINES.items():
            for deadline_data in deadlines:
                self._create_deadline(owner_group=groups[group_slug], data=deadline_data)

        self.stdout.write("Creation de notifications manuelles supplementaires...")
        all_users = list(users.values())

        welcome = Notification.objects.create(
            title="Bienvenue sur DeadlineMap",
            description="Nouvelle base de test chargee avec scenarios personnels et collaboratifs.",
        )
        NotificationUser.objects.bulk_create(
            [NotificationUser(notification=welcome, user=u, is_read=False) for u in all_users],
            ignore_conflicts=True,
        )

        release_note = Notification.objects.create(
            title="Info plateforme",
            description="Le flux notifications SSE est actif. Pensez a marquer les notifications lues.",
        )
        NotificationUser.objects.bulk_create(
            [
                NotificationUser(notification=release_note, user=users["alice.dupont"], is_read=True),
                NotificationUser(notification=release_note, user=users["bob.martin"], is_read=False),
                NotificationUser(notification=release_note, user=users["clara.leroy"], is_read=False),
                NotificationUser(notification=release_note, user=users["david.kahn"], is_read=True),
                NotificationUser(notification=release_note, user=users["emma.petit"], is_read=False),
            ],
            ignore_conflicts=True,
        )

        reminder_like = Notification.objects.create(
            title="Rappel prioritaire",
            description="Plusieurs deadlines arrivent dans 3 jours. Verifiez vos priorites.",
        )
        NotificationUser.objects.bulk_create(
            [
                NotificationUser(notification=reminder_like, user=users["alice.dupont"], is_read=False),
                NotificationUser(notification=reminder_like, user=users["bob.martin"], is_read=False),
                NotificationUser(notification=reminder_like, user=users["emma.petit"], is_read=False),
            ],
            ignore_conflicts=True,
        )

        self.stdout.write(self.style.SUCCESS("Seed termine avec succes."))
        self.stdout.write(
            self.style.SUCCESS(
                (
                    f"Users: {User.objects.filter(is_superuser=False).count()} | "
                    f"Groups: {Group.objects.count()} | "
                    f"Memberships: {GroupUser.objects.count()} | "
                    f"Deadlines: {Deadline.objects.count()} | "
                    f"Notifications: {Notification.objects.count()} | "
                    f"Notification links: {NotificationUser.objects.count()}"
                )
            )
        )
