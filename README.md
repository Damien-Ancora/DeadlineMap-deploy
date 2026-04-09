# ICHEC Deadline

ICHEC Deadline est une application web de gestion de tâches et d'échéances collaborative. Elle permet aux étudiants et aux groupes de travail de s'organiser efficacement en centralisant leurs devoirs, projets et examens.

L'application offre une distinction claire entre les **deadlines personnelles** (propres à l'utilisateur) et les **deadlines de groupe** (partagées avec tous les membres d'un groupe).

## 🚀 Fonctionnalités Principales

### 1. Gestion des Utilisateurs

- Inscription et authentification sécurisée (JWT).
- Gestion de profil.

### 2. Gestion des Groupes

- Création de groupes de travail.
- Ajout et suppression de membres par email.
- Rôle d'administrateur pour le créateur du groupe.
- Dissolution automatique du groupe si l'administrateur le quitte.

### 3. Gestion des Deadlines (Échéances)

- **Personnelles** : Visibles uniquement par l'utilisateur.
- **De Groupe** : Visibles par tous les membres du groupe.
- **Ownership exclusif** : Une deadline est soit personnelle, soit de groupe (jamais les deux).
- Suivi de l'état : À faire, En cours, Terminé.
- Priorisation : Basse, Moyenne, Haute.

### 4. Notifications Intelligentes

- Alertes automatiques lors de l'ajout à un groupe.
- Notification lors de la création d'une nouvelle deadline de groupe.
- Indicateur de lecture pour ne rien rater.

## 🏗 Architecture Technique

Le dépôt est organisé pour proposer deux visions du projet :

### 1. Application Web Complète (`backend/` & `frontend/`)

Il s'agit de la version finale et fonctionnelle du projet.

- **Backend (API)** : Développé avec **Django REST Framework**.
  - Structure modulaire (`apps/users`, `apps/groups`, `apps/deadlines`, `apps/notifications`).
  - Base de données SQLite (par défaut) pour le développement.
- **Frontend (Client)** : Développé avec **React** (via Vite).
  - Composants fonctionnels et Hooks.
  - Stylisation via CSS et Bootstrap.

### 2. Version Conceptuelle (`code_simplifiee/`)

Ce dossier contient une version simplifiée du système développée en pure Programmation Orientée Objet (POO) Python, sans base de données ni interface graphique. Elle sert à illustrer la logique métier brute de l'application et l'architecture de ses classes.

Arborescence globale :

```text
ICHEC_Deadline/
├── backend/                 # Application Web : API Django
│   ├── apps/                # Modules métiers (users, groups, deadlines, notifications)
│   ├── project_config/      # Configuration principale du projet Django
│   ├── requirements.txt     # Dépendances Python
│   └── manage.py            # Utilitaire de gestion Django
├── frontend/                # Application Web : Interface React
│   ├── src/                 # Code source principal (api, auth, components, hooks, pages...)
│   ├── public/              # Assets statiques
│   ├── package.json         # Dépendances Node.js et scripts
│   └── vite.config.js       # Configuration du bundler Vite
└── code_simplifiee/         # Logique pure : Simulation console en POO (hors web)
    └── main.py              # Point d'entrée de la simulation
```

## 🛠 Installation et Démarrage

### Prérequis

- Python 3.10+
- Node.js 14+ et npm

### 1. Installation du Backend

Rendez-vous dans le dossier `backend` :

```bash
cd backend
```

Créez et activez un environnement virtuel :

```bash
# macOS / Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python3 -m venv venv
venv\Scripts\activate
```

Installez les dépendances :

```bash
pip install -r requirements.txt
```

Appliquez les migrations pour créer la base de données :

```bash
# Macos / Linux
python manage.py migrate
```

```bash
# Windows
python3 manage.py migrate
```

Lancez le serveur de développement (par défaut sur `http://127.0.0.1:8000`) :

```bash
#Macos / Linux
python manage.py runserver
```

```bash
# Windows
python manage.py runserver
```

### 2. Installation du Frontend

Ouvrez un nouveau terminal et rendez-vous dans le dossier `frontend` :

```bash
cd frontend
```

Installez les paquets npm :

```bash
npm install
```

Lancez le serveur de développement (par défaut sur `http://localhost:5173`) :

```bash
npm run dev
```

Vous pouvez maintenant accéder à l'application via votre navigateur.

## ✅ Lancer les Tests Unitaires

Le projet dispose maintenant de tests backend et frontend.

### Tests Backend (Django)

La suite backend couvre l'authentification, les permissions et la logique métier.

Pour exécuter tous les tests backend :

```bash
# Assurez-vous d'être dans le dossier racine ou backend et d'avoir activé votre venv
python backend/manage.py test apps.users apps.groups apps.deadlines apps.notifications
```

Pour une sortie plus détaillée (verbosity 2) :

```bash
python backend/manage.py test apps.users apps.groups apps.deadlines apps.notifications --verbosity 2
```

### Tests Frontend (Vitest)

Depuis le dossier `frontend` :

```bash
npm test
```

Mode watch :

```bash
npm run test:watch
```

Lint frontend :

```bash
npm run lint
```

## 🌱 Seeder des Données de Démo

Le projet inclut un seed riche avec 5 comptes, plusieurs groupes, des deadlines variées et des notifications.

Depuis le dossier backend :

```bash
# macos / Linux
python manage.py seed_db
```

```bash
# Windows
python manage.py seed_db
```

Le seed :

- Supprime les anciennes données applicatives (hors superuser).
- Recrée exactement 5 comptes de test.
- Recharge un jeu de données complet (deadlines perso + groupe, scénarios en retard/imminents/complétés, notifications lues/non lues).

Les identifiants sont disponibles dans le fichier `credentials.txt` à la racine du projet.

## 👑 Administration (Super-utilisateurs)

Pour interagir avec les vrais super-utilisateurs (les "Administrateurs de base de données" de votre système) dans le backend Django, tout se passe en ligne de commande via le fichier `manage.py` situé dans le dossier `backend`.

### 1. Créer un Superuser

Ouvrez un terminal, placez-vous dans votre dossier `backend` (et activez votre environnement virtuel s'il y en a un), puis exécutez cette commande :

```bash
python3 manage.py createsuperuser
```

Django vous demandera interactivement de renseigner :

- Un nom d'utilisateur (ou email, selon votre configuration User)
- Un mot de passe (il ne s'affichera pas pendant que vous le tapez, c'est normal)
- La confirmation du mot de passe

### 2. Accéder à l'interface d'administration

Une fois le serveur de développement en cours d'exécution, rendez-vous sur la page [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/).
Connectez-vous à l'aide des identifiants du super-utilisateur que vous venez de créer afin de gérer les données de l'application via le panneau d'administration de Django.
