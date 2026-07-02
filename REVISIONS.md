# Fiche de révisions — Projet Planifi

---

## 1. Stack technique

| Couche           | Technologie              | Rôle                                                |
| ---------------- | ------------------------ | --------------------------------------------------- |
| Serveur          | Node.js v20 + Express.js | Gère les requêtes HTTP, les routes, les middlewares |
| Frontend         | React + Vite             | Interface client (SPA compilée dans `client/dist`)  |
| Templates        | EJS                      | Rendu HTML côté serveur (pages non-React)           |
| Styling          | Tailwind CSS             | Classes utilitaires directement dans le HTML        |
| Base de données  | PostgreSQL 15.2          | Stockage relationnel principal                      |
| Temps réel       | Socket.IO                | Messagerie instantanée entre users                  |
| Conteneurisation | Docker Compose           | Lance PostgreSQL + pgAdmin localement               |

---

## 2. Base de données — PostgreSQL

### Type

**Relationnel** — les données sont organisées en tables liées entre elles par des clés.

### Connexion

```
Driver : pg (node-postgres)
Host   : DB_HOST (variable d'environnement)
Port   : 5432
DB     : DB_DATABASE
```

### Tables, PK et FK

#### `users` — table centrale (clients ET pros)

| Colonne                        | Type         | Rôle                                     |
| ------------------------------ | ------------ | ---------------------------------------- |
| `users_id`                     | SERIAL       | **PK** — identifiant unique              |
| `email`                        | VARCHAR(100) | UNIQUE NOT NULL                          |
| `firstName` / `lastName`       | VARCHAR(100) |                                          |
| `password`                     | VARCHAR(100) | Mot de passe **haché** (bcrypt)          |
| `phone`                        | VARCHAR(20)  |                                          |
| `country` / `city` / `address` | VARCHAR      |                                          |
| `profile_picture`              | VARCHAR      | Chemin vers la photo                     |
| `est_pro`                      | BOOLEAN      | `false` = client, `true` = professionnel |
| `est_verifie`                  | BOOLEAN      | Compte confirmé par email                |
| `creation_date`                | TIMESTAMP    | Timezone Europe/Paris                    |

#### `pro_account` — profil étendu du pro (1:1 avec users)

| Colonne                            | Type       | Rôle                    |
| ---------------------------------- | ---------- | ----------------------- |
| `professional_id`                  | SERIAL     | **PK**                  |
| `company_name` / `company_address` | VARCHAR    |                         |
| `show_mobile` / `show_adress`      | BOOLEAN    | Visibilité publique     |
| `user_id`                          | INT UNIQUE | **FK → users.users_id** |

> Relation 1:1 : un pro a au maximum une fiche entreprise.

#### `services` — services proposés par un pro

| Colonne               | Type          | Rôle                    |
| --------------------- | ------------- | ----------------------- |
| `service_id`          | SERIAL        | **PK**                  |
| `service_name`        | VARCHAR(100)  |                         |
| `service_description` | TEXT          |                         |
| `service_price`       | DECIMAL(10,2) |                         |
| `duration`            | INTERVAL      | Durée du service        |
| `professional_id`     | INT           | **FK → users.users_id** |

> Relation 1:N : un pro peut avoir plusieurs services.

#### `availability` — créneaux de disponibilité

| Colonne                   | Type        | Rôle                    |
| ------------------------- | ----------- | ----------------------- |
| `availability_id`         | SERIAL      | **PK**                  |
| `day_of_week`             | VARCHAR(10) | Jour de la semaine      |
| `start_time` / `end_time` | TIME        | Plage horaire           |
| `professional_id`         | INT         | **FK → users.users_id** |

#### `reservations` — table pivot principale

| Colonne                   | Type                 | Rôle                                |
| ------------------------- | -------------------- | ----------------------------------- |
| `reservation_id`          | SERIAL               | **PK**                              |
| `day_of_week`             | VARCHAR(10) NOT NULL |                                     |
| `start_time` / `end_time` | TIME NOT NULL        |                                     |
| `professional_id`         | INT                  | **FK → users.users_id** (le pro)    |
| `users_id`                | INT                  | **FK → users.users_id** (le client) |
| `service_id`              | INT                  | **FK → services.service_id**        |

> C'est la table la plus importante : elle relie un **client** + un **pro** + un **service**.

#### `messages` — messagerie interne

| Colonne        | Type         | Rôle                                   |
| -------------- | ------------ | -------------------------------------- |
| `message_id`   | SERIAL       | **PK**                                 |
| `subject`      | VARCHAR(255) |                                        |
| `message_body` | TEXT         |                                        |
| `sent_at`      | TIMESTAMP    |                                        |
| `sender_id`    | INT          | **FK → users.users_id** (expéditeur)   |
| `receiver_id`  | INT          | **FK → users.users_id** (destinataire) |
| `service_id`   | INT          | **FK → services.service_id**           |

#### `notation` — avis et notes

| Colonne      | Type      | Rôle                    |
| ------------ | --------- | ----------------------- |
| `note_id`    | SERIAL    | **PK**                  |
| `rating`     | INT       | CHECK (1 ≤ rating ≤ 5)  |
| `comment`    | TEXT      |                         |
| `created_at` | TIMESTAMP |                         |
| `users_id`   | INT       | **FK → users.users_id** |

#### `images_services_professionals` — photos d'un service

| Colonne                      | Type    | Rôle                         |
| ---------------------------- | ------- | ---------------------------- |
| `image_id`                   | SERIAL  | **PK**                       |
| `image_URL` / `picture_path` | VARCHAR |                              |
| `pro_id`                     | INT     | **FK → users.users_id**      |
| `service_id`                 | INT     | **FK → services.service_id** |

---

## 3. Architecture — Pattern MVC

```
Requête HTTP
    ↓
[Route]           → définit l'URL et la méthode (GET, POST, PUT, DELETE)
    ↓
[Middleware]      → vérifie l'auth (JWT), valide les données, limite le débit
    ↓
[Controller]      → contient la logique métier
    ↓
[Base de données] → requêtes SQL via pg
    ↓
Réponse JSON
```

**Fichiers correspondants :**

```
routes/           → authentication.js, services.js, reservation.js...
middleware/       → authMiddleware.js, multer.js
controllers/      → authentificationController.js, servicesController.js...
db/               → database.js (connexion + création des tables)
```

---

## 4. API REST

### Type : REST (Representational State Transfer)

Chaque route suit la convention `verbe HTTP + ressource` :

| Méthode | Exemple           | Action               |
| ------- | ----------------- | -------------------- |
| GET     | `/service/:id`    | Lire un service      |
| POST    | `/service/create` | Créer un service     |
| PUT     | `/service/:id`    | Modifier un service  |
| DELETE  | `/service/:id`    | Supprimer un service |

### Codes HTTP utilisés

```
200 → Succès
201 → Créé avec succès
204 → Succès sans contenu
400 → Données invalides (Bad Request)
401 → Non authentifié (Unauthorized)
429 → Trop de requêtes (rate limit)
500 → Erreur serveur interne
```

### Endpoint de santé

```
GET /api/health → { status: "ok", service: "planifi-api", timestamp: "..." }
```

---

## 5. Authentification

### Flux complet

```
1. POST /connexion (email + password)
2. Serveur vérifie le mot de passe avec bcrypt.compare()
3. Serveur crée un JWT signé (JWT_SECRET)
4. JWT envoyé dans un cookie httpOnly (5 jours)
5. À chaque requête protégée → middleware requiredAuth lit req.cookies.jwt
6. JWT vérifié → next() ou 401
```

### JWT — contenu du payload

```js
{ id: users_id, statut: "client" | "professionnel", type: "" }
```

### Cookie JWT

```js
httpOnly: true      // JavaScript ne peut pas le lire (protection XSS)
secure: true        // HTTPS uniquement (en production)
maxAge: 5 jours     // Expiration
```

### Hachage des mots de passe

```js
const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);
// → $2b$10$[sel 22 chars][haché 31 chars] = 60 chars total
```

Toujours 60 caractères → `password VARCHAR(100)` est bien dimensionné.

### Routes protégées vs publiques

```js
// Publique — accessible sans être connecté
router.post(
	'/inscription/utilisateur',
	registrationLimiter,
	controller.register,
);
router.post('/connexion', authLimiter, controller.login);

// Protégée — middleware requiredAuth obligatoire
router.get('/service', requiredAuth, serviceController.service_all_get);
router.post(
	'/service/create',
	requiredAuth,
	serviceController.service_create_post,
);
```

---

## 6. Middlewares

### `authMiddleware.js` — `requiredAuth`

Vérifie que le cookie `jwt` existe et est valide. Sinon → 401.

```js
const token = req.cookies.jwt;
jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) → sendUnauthorized(res)
    else     → next()
});
```

### `multer.js` — Upload de fichiers

- Types acceptés : `jpeg`, `jpg`, `png`, `gif`
- Taille max : **10 MB** par fichier
- Mode : `memoryStorage` (en mémoire, pas sur le disque)
- Upload simple (`uploadSingle`) ou multiple (max 12 fichiers, `uploadMultiple`)

---

## 7. Sécurité

| Menace                   | Protection en place                                                   |
| ------------------------ | --------------------------------------------------------------------- |
| Brute-force login        | `express-rate-limit` (authLimiter)                                    |
| Brute-force inscription  | `registrationLimiter`                                                 |
| Spam email reset/confirm | `sendMailResetPasswordLimiter` / `sendMailConfirmRegistrationLimiter` |
| Vol de token (XSS)       | Cookie `httpOnly: true`                                               |
| Données invalides        | Validation Joi sur tous les inputs                                    |
| Mots de passe en clair   | bcrypt (saltRounds: 10)                                               |
| Fichiers malveillants    | Multer fileFilter (types + taille)                                    |
| Compte dupliqué          | Vérification `email UNIQUE` en base                                   |

> ⚠️ **Point à corriger** : `express-session` est configuré sans `httpOnly` et `secure` explicites.  
> ⚠️ **Point à corriger** : certaines routes de messagerie (`/api/send-message`) ne passent pas par `requiredAuth`.

---

## 8. Temps réel — Socket.IO

Utilisé pour la messagerie instantanée.

```js
// Côté serveur
io.on('connection', (socket) => {
	// Rejoindre une room (une conversation)
	socket.on('join_room', (room) => socket.join(room));

	// Envoyer un message
	socket.on('send_message', async (data) => {
		// INSERT en base → puis emit au destinataire
		socket.to(receiver_id).emit('new_message', message);
	});
});
```

**Événements :**

- `join_room` → rejoindre une conversation
- `send_message` → envoyer un message (écrit en base + envoyé en temps réel)
- `new_message` → reçu par le destinataire
- `message_sent` → confirmation à l'expéditeur
- `message_error` → erreur d'envoi

---

## 9. Validation des données — Joi

Joi valide les données **avant** qu'elles arrivent en base de données.

```js
// Exemple : inscription utilisateur
firstName: Joi.string().min(2).max(30).trim().required();
email: Joi.string().email().trim().required();
password: Joi.string().min(8).max(60).required();
phone: Joi.string().min(10).max(15).required();

// Exemple : service
service_name: Joi.string().min(2).max(30).trim().required();
service_price: Joi.number().min(0).required();
duration: Joi.number().min(1).required();

// Exemple : créneau de disponibilité
start_time: Joi.string()
	.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
	.required();
// → valide le format HH:MM (ex: "09:30")
```

---

## 10. Logging — Winston

Tous les événements importants sont loggés avec Winston.

```
logs/error.log    → uniquement les erreurs (archivé en .gz)
logs/combined.log → tout (debug + info + erreurs)
Console           → colorisé, en temps réel
```

Format : `[LOGGER] 26-06-09 10:30:00 info: Message`

---

## 11. Emails — Nodemailer

Serveur SMTP : `acajou.o2switch.net` (port 465, SSL)

Templates disponibles :

- Confirmation d'inscription (lien de vérification)
- Réinitialisation de mot de passe
- Confirmation de RDV (client + pro)
- Annulation de RDV (client + pro)

---

## 12. Infrastructure Docker

```yaml
# docker-compose.yml
postgresql: → PostgreSQL 15.2 sur le port 5432
pgadminAnalytics: → Interface pgAdmin sur http://localhost:5050
```

pgAdmin permet d'explorer la base de données visuellement (login: `admin@admin.com`).

---

## 13. Librairies clés

| Librairie                     | Usage                                |
| ----------------------------- | ------------------------------------ |
| `bcrypt`                      | Hachage des mots de passe            |
| `jsonwebtoken`                | Création et vérification des JWT     |
| `joi`                         | Validation des données entrantes     |
| `express-rate-limit`          | Anti-bruteforce                      |
| `cookie-parser`               | Lecture de `req.cookies`             |
| `express-session`             | Gestion des sessions                 |
| `multer`                      | Upload de fichiers (images)          |
| `nodemailer`                  | Envoi d'emails                       |
| `socket.io`                   | Messagerie temps réel                |
| `winston`                     | Logging (fichiers + console)         |
| `moment`                      | Manipulation des dates               |
| `fullcalendar`                | Affichage calendrier interactif      |
| `firebase` + `firebase-admin` | Auth / stockage Firebase             |
| `@google-cloud/storage`       | Stockage fichiers GCP                |
| `pg` + `pg-promise`           | Connexion et requêtes PostgreSQL     |
| `uuid-v4`                     | Génération d'identifiants uniques    |
| `dotenv`                      | Variables d'environnement (`.env`)   |
| `concurrently`                | Lancer serveur + client en parallèle |

---

## 14. Variables d'environnement (.env)

```
DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT  → PostgreSQL
JWT_SECRET                                            → Signature des JWT
SECRET_KEY                                            → Clé session Express
MAIL_USERNAME, MAIL_PASSWORD                          → Compte SMTP
```

---

## 15. Responsive — Comment le site s'adapte aux écrans

Le projet utilise **deux approches** selon la partie du code :

### Partie React (`client/src`) → Tailwind CSS breakpoints

Tailwind gère le responsive avec des préfixes directement dans les classes HTML. Pas de fichier CSS séparé.

| Préfixe   | Taille d'écran              | Usage typique      |
| --------- | --------------------------- | ------------------ |
| _(aucun)_ | Mobile d'abord (tout écran) | Style de base      |
| `sm:`     | ≥ 640px                     | Petits ajustements |
| `md:`     | ≥ 768px                     | Tablette           |
| `lg:`     | ≥ 1024px                    | Desktop standard   |
| `xl:`     | ≥ 1280px                    | Grand écran        |

**Principe : mobile-first.** On écrit le style pour mobile, puis on surcharge pour les grands écrans.

```jsx
// Exemple dans ConnectedNavbar.jsx
// Sur mobile : caché (hidden)
// Sur desktop (lg) : visible en flex
<div className="hidden lg:flex items-center gap-6">
  {/* icônes nav */}
</div>

// Grille : 1 colonne sur mobile, 2 colonnes sur xl
<div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">

// Navbar sticky collée en haut avec flou de fond
<header className="sticky top-0 z-50 bg-white/78 backdrop-blur-md">

// Largeur max centrée
<div className="mx-auto w-full max-w-[1480px] px-6 xl:px-8">
```

### Partie EJS (`views/`, `public/css/`) → CSS classique avec `@media`

Les pages rendues côté serveur utilisent des fichiers CSS séparés avec des media queries classiques.

```css
/* Exemple dans public/css/ */
@media (max-width: 768px) {
	/* styles mobile */
}

@media (min-width: 768px) {
	/* styles tablette et plus */
}
```

### Résumé

```
React (client/src)    → Tailwind classes   → sm: md: lg: xl:
EJS  (views/)         → CSS fichiers       → @media queries
```

Les deux coexistent dans le même projet car certaines pages sont en EJS (ancien rendu serveur) et d'autres sont en React (nouvelle partie SPA sous `/app`).

---

## 16. Concepts JavaScript utiles

## 16. Hooks React — à quoi ils servent dans Planifi

Un **hook** est une fonction spéciale de React qui permet à un composant fonctionnel de :

- stocker un état (`useState`)
- lancer un effet quand quelque chose change (`useEffect`)
- garder une référence vers un élément ou une valeur persistante (`useRef`)
- factoriser de la logique réutilisable (hooks custom comme `useSession`)

### Pourquoi on les utilise

Sans hooks, un composant React afficherait juste du HTML.  
Avec les hooks, il peut :

- charger des données depuis le back
- ouvrir/fermer une modale
- suivre ce que l'utilisateur tape dans un champ
- animer un bloc quand il entre dans l'écran
- partager la même logique entre plusieurs composants

### `useState` — mémoriser une valeur dans l'interface

`useState` sert à stocker une donnée qui peut changer pendant la vie du composant.

```jsx
const [open, setOpen] = useState(false);
```

Exemples dans le projet :

- [AuthPage.jsx](/Users/djamal/Projets/Planifi/client/src/components/AuthPage/AuthPage.jsx)  
  `mode`, `isProfessional`, `signupError`, `loginError`
- [ReservationPage.jsx](/Users/djamal/Projets/Planifi/client/src/components/ReservationPage/ReservationPage.jsx)  
  `selectedSlot`, `note`, `weekOffset`, `scheduleLoading`
- [ConnectedNavbar.jsx](/Users/djamal/Projets/Planifi/client/src/components/ConnectedNavbar/ConnectedNavbar.jsx)  
  `open` pour ouvrir/fermer le menu mobile

Exemple simple tiré de l'idée du projet :

```jsx
const [selectedSlot, setSelectedSlot] = useState(null);
// → mémorise le créneau choisi par le client avant confirmation
```

### `useEffect` — exécuter du code au bon moment

`useEffect` sert à exécuter un code :

- au chargement d'une page
- quand une valeur change
- pour s'abonner à un événement puis se désabonner proprement

Exemple réel dans [useSession.js](/Users/djamal/Projets/Planifi/client/src/hooks/useSession.js) :

```jsx
useEffect(() => {
  let cancelled = false;

  async function loadSession() {
    const response = await fetch('/profil', { credentials: 'same-origin' });
    ...
  }

  loadSession();
  return () => {
    cancelled = true;
  };
}, []);
```

Ici :

- l'effet tourne au montage du composant
- il appelle le backend pour savoir si l'utilisateur est connecté
- `return () => { ... }` sert au nettoyage

Autres exemples :

- [App.jsx](/Users/djamal/Projets/Planifi/client/src/App.jsx)  
  écoute les changements de navigation
- [CalendarPage.jsx](/Users/djamal/Projets/Planifi/client/src/components/CalendarPage/CalendarPage.jsx)  
  charge les réservations du calendrier
- [NavigationPage.jsx](/Users/djamal/Projets/Planifi/client/src/components/NavigationPage/NavigationPage.jsx)  
  recharge les données selon la recherche

### `useRef` — garder une référence stable

`useRef` sert à garder une valeur qui persiste entre les renders sans provoquer de re-render.

Exemple simple :

```jsx
const menuRef = useRef(null);
```

Exemples dans le projet :

- [ConnectedNavbar.jsx](/Users/djamal/Projets/Planifi/client/src/components/ConnectedNavbar/ConnectedNavbar.jsx)  
  `menuRef` pour détecter les clics hors menu
- [CalendarPage.jsx](/Users/djamal/Projets/Planifi/client/src/components/CalendarPage/CalendarPage.jsx)  
  `calendarRef` pour piloter FullCalendar
- [useReveal.js](/Users/djamal/Projets/Planifi/client/src/hooks/useReveal.js)  
  `ref` pour observer un élément DOM avec `IntersectionObserver`

Exemple concret :

```jsx
const calendarRef = useRef(null);
// → permet d'appeler l'API FullCalendar sans re-render la page
```

### `useMemo` — éviter de recalculer inutilement

`useMemo` sert à mémoriser le résultat d'un calcul coûteux tant que ses dépendances ne changent pas.

Exemple dans [CalendarPage.jsx](/Users/djamal/Projets/Planifi/client/src/components/CalendarPage/CalendarPage.jsx) :

```jsx
const calendarEvents = useMemo(
	() => buildCalendarEvents(reservations),
	[reservations],
);
```

Ici :

- on transforme les réservations backend en événements calendrier
- React ne refait ce calcul que si `reservations` change

Autres usages :

- filtrer les événements à venir
- calculer le label de semaine
- dériver la liste affichée dans un panneau

### Hooks custom du projet

Un **hook custom** est juste une fonction React qui commence par `use` et qui encapsule une logique réutilisable.

#### `useSession`

Fichier : [useSession.js](/Users/djamal/Projets/Planifi/client/src/hooks/useSession.js)

Rôle :

- appelle `/profil`
- détecte si l'utilisateur est connecté
- expose `loading`, `isAuthenticated`, `profile`

Utilisé par :

- [AppHeader.jsx](/Users/djamal/Projets/Planifi/client/src/components/AppHeader/AppHeader.jsx)

Exemple :

```jsx
const { loading, isAuthenticated, profile } = useSession();
```

#### `useNavigationSearch`

Fichier : [useNavigationSearch.js](/Users/djamal/Projets/Planifi/client/src/hooks/useNavigationSearch.js)

Rôle :

- gère les champs de recherche
- gère les suggestions de services et de villes
- construit l'URL `/navigation?q=...&ville=...`
- redirige proprement via `navigateTo()`

Utilisé par :

- [Hero.jsx](/Users/djamal/Projets/Planifi/client/src/components/Hero/Hero.jsx)
- [ConnectedNavbar.jsx](/Users/djamal/Projets/Planifi/client/src/components/ConnectedNavbar/ConnectedNavbar.jsx)

Exemple :

```jsx
const { query, setQuery, ville, setVille, handleSearch } =
	useNavigationSearch();
```

#### `useReveal`

Fichier : [useReveal.js](/Users/djamal/Projets/Planifi/client/src/hooks/useReveal.js)

Rôle :

- observe un bloc avec `IntersectionObserver`
- ajoute `data-visible="true"` quand il entre dans l'écran
- permet de déclencher une animation d'apparition

Utilisé par :

- [Reveal.jsx](/Users/djamal/Projets/Planifi/client/src/components/Reveal/Reveal.jsx)

Exemple :

```jsx
const ref = useReveal();
// → le composant devient visible avec animation quand il entre dans le viewport
```

#### `useBodyScrollLock`

Fichier : [ProfilePage.shared.jsx](/Users/djamal/Projets/Planifi/client/src/components/ProfilePage/ProfilePage.shared.jsx)

Rôle :

- bloque le scroll du `body` quand une modale est ouverte

Exemple :

```jsx
useBodyScrollLock(open);
```

### Résumé rapide

```txt
useState   → stocker une valeur qui change
useEffect  → lancer un effet (fetch, event listener, animation...)
useRef     → garder une référence persistante
useMemo    → mémoriser un calcul dérivé
useSession → savoir si l'utilisateur est connecté
useNavigationSearch → gérer la recherche et les suggestions
useReveal  → animer un bloc à l'apparition
```

### Dans Planifi, les hooks servent donc à :

- gérer la connexion utilisateur
- piloter la recherche de prestations
- charger les réservations et profils depuis le back
- ouvrir/fermer menus, modales et panneaux
- animer l'interface React

---

## 17. Concepts JavaScript utiles

### `event.preventDefault()`

Empêche le **comportement par défaut** du navigateur sur un événement.

Le cas le plus courant : un formulaire recharge la page quand on le soumet. `preventDefault()` stoppe ça pour pouvoir gérer l'envoi manuellement.

```js
form.addEventListener('submit', (event) => {
	event.preventDefault(); // stoppe le rechargement de page

	// maintenant on contrôle : fetch(), validation, etc.
	fetch('/connexion', { method: 'POST', body: formData });
});
```

Autres usages :

- `<a href="#">` → empêche de remonter en haut de page
- Drag & drop → empêche le navigateur d'ouvrir le fichier déposé
- Touche Entrée dans un input → empêche la soumission automatique

### `req.cookies`

Objet Express contenant tous les cookies envoyés par le browser. Nécessite `cookie-parser`.

```js
const token = req.cookies.jwt; // lit le cookie JWT
```

### `trim()`

Supprime les espaces au début et à la fin d'une chaîne.

```js
'  mon service  '.trim(); // → "mon service"
```

Utilisé dans Joi (`Joi.string().trim()`) pour nettoyer les inputs avant validation.

### Les dépendances du `useEffect`

Le deuxième argument de `useEffect` contrôle quand il se relance.

```js
useEffect(() => { ... }, []);
// [] vide → s'exécute UNE SEULE FOIS au montage du composant

useEffect(() => { ... }, [searchQuery, searchVille]);
// → se relance à chaque fois que searchQuery OU searchVille change

useEffect(() => { ... });
// pas de tableau → se relance à CHAQUE re-render (dangereux, éviter)
```

**Erreur classique** : mettre `[]` quand on dépend d'une valeur qui change → le code tourne avec les valeurs initiales et ne se met jamais à jour.

### `async` / `await`

Permet d'attendre le résultat d'une opération asynchrone (requête SQL, appel API) sans bloquer le reste du code.

```js
// Sans async/await → callback hell
client.query(sql, (err, result) => { ... });

// Avec async/await → lisible
const result = await client.query(sql, [params]);
const rows = result.rows;
```

### `next()` dans un middleware

Passe la requête au middleware ou à la route suivante. Sans `next()`, la requête reste bloquée.

```js
const requiredAuth = (req, res, next) => {
  if (!token) return res.status(401).json({ ... }); // bloque
  next(); // laisse passer vers la route
};
```

### Input contrôlé en React

Un input "contrôlé" c'est un input dont la valeur est gérée par un `useState` React, via `value` + `onChange`.

```jsx
const [query, setQuery] = useState('');

<input
	value={query} // React contrôle la valeur affichée
	onChange={(e) => setQuery(e.target.value)} // met à jour le state à chaque frappe
/>;
```

Sans ça, l'input est "non contrôlé" : le navigateur gère la valeur seul et React ne sait pas ce que l'user a tapé.

### `encodeURIComponent()`

Encode une chaîne pour qu'elle soit sûre dans une URL. Gère les espaces, accents et caractères spéciaux.

```js
encodeURIComponent('coiffure à Paris'); // → "coiffure%20%C3%A0%20Paris"

// Dans une URL de recherche :
navigateTo(
	`/navigation?q=${encodeURIComponent(query)}&ville=${encodeURIComponent(ville)}`,
);
```

Sans ça, un espace ou un `&` dans le texte cassait l'URL.

### `URLSearchParams`

API JavaScript native pour lire les paramètres dans une URL.

```js
// URL courante : /navigation?q=coiffure&ville=paris
const params = new URLSearchParams(window.location.search);
const q = params.get('q'); // → "coiffure"
const ville = params.get('ville'); // → "paris"
const absent = params.get('xyz'); // → null
```

Utilisé dans `NavigationPage.jsx` pour lire les termes de recherche passés depuis `Hero.jsx` ou `ConnectedNavbar.jsx`.

### `ILIKE` en SQL (PostgreSQL)

Comme `LIKE` mais insensible à la casse. `%` = n'importe quels caractères.

```sql
-- Trouve "Coiffure", "coiffure", "COIFFURE", "macoiffure"...
WHERE LOWER(service_name) ILIKE '%coiffure%'

-- $1 = paramètre (évite les injections SQL)
WHERE LOWER(service_name) ILIKE $1
-- avec la valeur : '%coiffure%'
```

### Injection SQL — pourquoi utiliser `$1`, `$2`...

Ne jamais coller une variable directement dans une requête SQL.

```js
// ❌ DANGEREUX — injection SQL possible
client.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ SÉCURISÉ — pg échappe automatiquement la valeur
client.query(`SELECT * FROM users WHERE email = $1`, [email]);
```

Un attaquant pourrait sinon taper `'; DROP TABLE users; --` dans un champ et détruire la base.
