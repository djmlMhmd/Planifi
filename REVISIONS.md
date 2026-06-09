# Fiche de révisions — Projet Planifi

---

## 1. Stack technique

| Couche | Technologie | Rôle |
|---|---|---|
| Serveur | Node.js v20 + Express.js | Gère les requêtes HTTP, les routes, les middlewares |
| Frontend | React + Vite | Interface client (SPA compilée dans `client/dist`) |
| Templates | EJS | Rendu HTML côté serveur (pages non-React) |
| Styling | Tailwind CSS | Classes utilitaires directement dans le HTML |
| Base de données | PostgreSQL 15.2 | Stockage relationnel principal |
| Temps réel | Socket.IO | Messagerie instantanée entre users |
| Conteneurisation | Docker Compose | Lance PostgreSQL + pgAdmin localement |

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
| Colonne | Type | Rôle |
|---|---|---|
| `users_id` | SERIAL | **PK** — identifiant unique |
| `email` | VARCHAR(100) | UNIQUE NOT NULL |
| `firstName` / `lastName` | VARCHAR(100) | |
| `password` | VARCHAR(100) | Mot de passe **haché** (bcrypt) |
| `phone` | VARCHAR(20) | |
| `country` / `city` / `address` | VARCHAR | |
| `profile_picture` | VARCHAR | Chemin vers la photo |
| `est_pro` | BOOLEAN | `false` = client, `true` = professionnel |
| `est_verifie` | BOOLEAN | Compte confirmé par email |
| `creation_date` | TIMESTAMP | Timezone Europe/Paris |

#### `pro_account` — profil étendu du pro (1:1 avec users)
| Colonne | Type | Rôle |
|---|---|---|
| `professional_id` | SERIAL | **PK** |
| `company_name` / `company_address` | VARCHAR | |
| `show_mobile` / `show_adress` | BOOLEAN | Visibilité publique |
| `user_id` | INT UNIQUE | **FK → users.users_id** |

> Relation 1:1 : un pro a au maximum une fiche entreprise.

#### `services` — services proposés par un pro
| Colonne | Type | Rôle |
|---|---|---|
| `service_id` | SERIAL | **PK** |
| `service_name` | VARCHAR(100) | |
| `service_description` | TEXT | |
| `service_price` | DECIMAL(10,2) | |
| `duration` | INTERVAL | Durée du service |
| `professional_id` | INT | **FK → users.users_id** |

> Relation 1:N : un pro peut avoir plusieurs services.

#### `availability` — créneaux de disponibilité
| Colonne | Type | Rôle |
|---|---|---|
| `availability_id` | SERIAL | **PK** |
| `day_of_week` | VARCHAR(10) | Jour de la semaine |
| `start_time` / `end_time` | TIME | Plage horaire |
| `professional_id` | INT | **FK → users.users_id** |

#### `reservations` — table pivot principale
| Colonne | Type | Rôle |
|---|---|---|
| `reservation_id` | SERIAL | **PK** |
| `day_of_week` | VARCHAR(10) NOT NULL | |
| `start_time` / `end_time` | TIME NOT NULL | |
| `professional_id` | INT | **FK → users.users_id** (le pro) |
| `users_id` | INT | **FK → users.users_id** (le client) |
| `service_id` | INT | **FK → services.service_id** |

> C'est la table la plus importante : elle relie un **client** + un **pro** + un **service**.

#### `messages` — messagerie interne
| Colonne | Type | Rôle |
|---|---|---|
| `message_id` | SERIAL | **PK** |
| `subject` | VARCHAR(255) | |
| `message_body` | TEXT | |
| `sent_at` | TIMESTAMP | |
| `sender_id` | INT | **FK → users.users_id** (expéditeur) |
| `receiver_id` | INT | **FK → users.users_id** (destinataire) |
| `service_id` | INT | **FK → services.service_id** |

#### `notation` — avis et notes
| Colonne | Type | Rôle |
|---|---|---|
| `note_id` | SERIAL | **PK** |
| `rating` | INT | CHECK (1 ≤ rating ≤ 5) |
| `comment` | TEXT | |
| `created_at` | TIMESTAMP | |
| `users_id` | INT | **FK → users.users_id** |

#### `images_services_professionals` — photos d'un service
| Colonne | Type | Rôle |
|---|---|---|
| `image_id` | SERIAL | **PK** |
| `image_URL` / `picture_path` | VARCHAR | |
| `pro_id` | INT | **FK → users.users_id** |
| `service_id` | INT | **FK → services.service_id** |

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

| Méthode | Exemple | Action |
|---|---|---|
| GET | `/service/:id` | Lire un service |
| POST | `/service/create` | Créer un service |
| PUT | `/service/:id` | Modifier un service |
| DELETE | `/service/:id` | Supprimer un service |

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
router.post('/inscription/utilisateur', registrationLimiter, controller.register);
router.post('/connexion', authLimiter, controller.login);

// Protégée — middleware requiredAuth obligatoire
router.get('/service', requiredAuth, serviceController.service_all_get);
router.post('/service/create', requiredAuth, serviceController.service_create_post);
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

| Menace | Protection en place |
|---|---|
| Brute-force login | `express-rate-limit` (authLimiter) |
| Brute-force inscription | `registrationLimiter` |
| Spam email reset/confirm | `sendMailResetPasswordLimiter` / `sendMailConfirmRegistrationLimiter` |
| Vol de token (XSS) | Cookie `httpOnly: true` |
| Données invalides | Validation Joi sur tous les inputs |
| Mots de passe en clair | bcrypt (saltRounds: 10) |
| Fichiers malveillants | Multer fileFilter (types + taille) |
| Compte dupliqué | Vérification `email UNIQUE` en base |

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
firstName: Joi.string().min(2).max(30).trim().required()
email:     Joi.string().email().trim().required()
password:  Joi.string().min(8).max(60).required()
phone:     Joi.string().min(10).max(15).required()

// Exemple : service
service_name:  Joi.string().min(2).max(30).trim().required()
service_price: Joi.number().min(0).required()
duration:      Joi.number().min(1).required()

// Exemple : créneau de disponibilité
start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
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
postgresql:        → PostgreSQL 15.2 sur le port 5432
pgadminAnalytics:  → Interface pgAdmin sur http://localhost:5050
```

pgAdmin permet d'explorer la base de données visuellement (login: `admin@admin.com`).

---

## 13. Librairies clés

| Librairie | Usage |
|---|---|
| `bcrypt` | Hachage des mots de passe |
| `jsonwebtoken` | Création et vérification des JWT |
| `joi` | Validation des données entrantes |
| `express-rate-limit` | Anti-bruteforce |
| `cookie-parser` | Lecture de `req.cookies` |
| `express-session` | Gestion des sessions |
| `multer` | Upload de fichiers (images) |
| `nodemailer` | Envoi d'emails |
| `socket.io` | Messagerie temps réel |
| `winston` | Logging (fichiers + console) |
| `moment` | Manipulation des dates |
| `fullcalendar` | Affichage calendrier interactif |
| `firebase` + `firebase-admin` | Auth / stockage Firebase |
| `@google-cloud/storage` | Stockage fichiers GCP |
| `pg` + `pg-promise` | Connexion et requêtes PostgreSQL |
| `uuid-v4` | Génération d'identifiants uniques |
| `dotenv` | Variables d'environnement (`.env`) |
| `concurrently` | Lancer serveur + client en parallèle |

---

## 14. Variables d'environnement (.env)

```
DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT  → PostgreSQL
JWT_SECRET                                            → Signature des JWT
SECRET_KEY                                            → Clé session Express
MAIL_USERNAME, MAIL_PASSWORD                          → Compte SMTP
```
