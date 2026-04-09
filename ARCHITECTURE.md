# DeadlineMap — Architecture & Choix Technologiques

## Stack Technologique

| Couche          | Technologie                    | Rôle                                     |
| --------------- | ------------------------------ | ---------------------------------------- |
| Frontend        | React + Vite                   | Interface utilisateur, gestion des états |
| Backend         | Django + Django REST Framework | Logique métier, exposition API REST      |
| Base de données | SQLite                         | Stockage des données                     |

---

## Architecture Globale

Architecture **client–serveur** avec communication via **API REST**.

```
React + Vite  (port 5173)
      │
      │  HTTP / JSON
      ▼
Django REST API  (port 8000)
      │
      ▼
SQLite Database  (db.sqlite3)
```

Le frontend et le backend sont **découplés** : React consomme les endpoints exposés par Django via `fetch` ou `axios`. Le backend retourne exclusivement du JSON.

---

## Architecture Frontend

Pattern : **Component-Based Architecture** (React) + **SPA** avec React Router DOM.

```
frontend/
│
├── public/
│   └── vite.svg
├── index.html                    # Point d'entrée HTML
└── src/
    ├── assets/                   # Images, icônes
    ├── styles/
    │   └── bootstrap.min.css     # Bootstrap 5 (local)
    ├── components/
    │   ├── App/
    │   │   ├── App.jsx           # Composant racine — layout (Navbar + Outlet + Footer)
    │   │   └── App.css
    │   ├── Navbar/
    │   │   ├── Navbar.jsx        # Navbar visiteur (non connecté)
    │   │   └── NavbarAuth.jsx    # Navbar utilisateur connecté
    │   ├── Header/
    │   │   └── Header.jsx        # Composant header générique
    │   ├── Footer/
    │   │   └── Footer.jsx
    │   └── Pages/
    │       ├── HomePage.jsx      # Page d'accueil (hero + features)
    │       ├── LoginPage.jsx     # Formulaire de connexion
    │       └── RegisterPage.jsx  # Formulaire d'inscription
    ├── index.css
    └── main.jsx                  # Router + point d'entrée React
```

**Routing (React Router DOM v7) :**

```
/              → App (layout)
├── /          → HomePage
├── /login     → LoginPage
└── /register  → RegisterPage
```

**Principes :**

- `main.jsx` configure le `createBrowserRouter` et monte l'application
- `App.jsx` est le composant layout : il affiche `Navbar`, `<Outlet />` (pages) et `Footer`
- La Navbar est conditionnelle selon l'état d'authentification (`isLoggedIn`)
- Bootstrap 5 assure le style (chargé localement depuis `styles/bootstrap.min.css`)
- Vite assure le hot reload et le build optimisé

**Dépendances principales :**

| Package            | Version | Rôle                    |
| ------------------ | ------- | ----------------------- |
| `react`            | 19.2.0  | Bibliothèque UI         |
| `react-router-dom` | 7.13.1  | Routing côté client     |
| `bootstrap`        | 5.3.8   | Framework CSS           |
| `vite`             | 7.3.1   | Build tool / dev server |

---

## Architecture Backend

Pattern : **MTV (Model – Template – View)** — sans templates (contexte API).

```
backend/
│
├── manage.py
│
├── project_config/           # Configuration globale Django
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
└── apps/                     # Modules fonctionnels
    └── <app>/
        ├── models.py         # Structure base de données (ORM)
        ├── views.py          # Logique + endpoints API
        ├── serializers.py    # Conversion Python ↔ JSON
        ├── urls.py           # Routes API
        └── admin.py          # Interface admin Django
```

**Rôles des fichiers :**

| Fichier          | Rôle                                               |
| ---------------- | -------------------------------------------------- |
| `models.py`      | Définit les entités et leur mapping en base        |
| `views.py`       | Contient la logique métier et les endpoints        |
| `serializers.py` | Traduit les objets Python en JSON (et inversement) |
| `urls.py`        | Déclare les routes de l'API                        |
| `admin.py`       | Enregistre les modèles dans l'interface admin      |

---

## Communication Frontend / Backend

Verbes HTTP standard (API REST) :

```
GET    /api/<resource>/         → Lister
POST   /api/<resource>/         → Créer
GET    /api/<resource>/{id}/    → Détail
PUT    /api/<resource>/{id}/    → Modifier
DELETE /api/<resource>/{id}/    → Supprimer
```

Exemple de réponse JSON :

```json
{
  "id": 1,
  "title": "Rendu rapport UML",
  "date": "2026-03-22",
  "priority": "high"
}
```

---

## Justification des Choix

**React + Vite**

- React : bibliothèque éprouvée pour les interfaces dynamiques basées sur des composants
- Vite : dev server rapide, hot reload natif, remplace Create React App

**Django REST Framework**

- Extension officielle de Django pour créer des API REST
- Serializers, authentification, permissions et pagination intégrés
- Suffisant et adapté pour un projet académique

**SQLite**

- Base embarquée, aucun serveur à configurer
- Utilisée par défaut par Django
- Idéale pour le développement et les projets académiques

---

_Ce document sera complété avec l'analyse fonctionnelle, les diagrammes UML et les détails d'implémentation._
