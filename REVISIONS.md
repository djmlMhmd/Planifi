# Fiche de révisions — Planifi

## 1. Stack actuelle

| Couche | Technologie | Rôle |
| --- | --- | --- |
| Serveur | Node.js + Express | Routes HTTP, middlewares, API |
| Frontend | React + Vite | SPA servie depuis `client/dist` |
| Base de données | PostgreSQL | Stockage principal |
| Upload | Multer + disque local | Photos de profil et images de services |
| Auth | JWT + cookies | Protection des routes |

## 2. Architecture

Le projet suit une structure assez classique :

```text
routes/        -> définition des endpoints
controllers/   -> logique métier
middleware/    -> auth, upload, rate limit
db/            -> connexion PostgreSQL + création de tables
client/        -> front React actuel
public/uploads -> fichiers uploadés
```

## 3. Routes front React

Les écrans principaux sont servis par le shell React :

- `/`
- `/connexion/`
- `/inscription/`
- `/navigation`
- `/services`
- `/app/reservation`
- `/app/calendar`
- `/app/profil`
- `/app/profil/professionnel`

Certaines anciennes URLs HTML sont gardées en redirection pour éviter de casser des accès existants.

## 4. API côté serveur

Exemples d'endpoints encore actifs :

- `GET /api/health`
- `GET /profil`
- `GET /profil/professionnel`
- `GET /service`
- `GET /service/:id/liste`
- `POST /reservation`
- `GET /reservation`
- `GET /reservation/client`
- `GET /reservation/reservedHours`
- `DELETE /reservation/:reservationId`

## 5. Authentification

Le flux actuel repose sur :

1. Connexion utilisateur
2. Création d'un JWT
3. Stockage du token dans un cookie
4. Vérification du cookie via `requiredAuth` sur les routes protégées

## 6. Uploads

Les images ne passent plus par Firebase.

- Photos de profil : `public/uploads/profile-picture`
- Images de services : `public/uploads/service-images`

Le back stocke une URL relative de type :

```text
/uploads/profile-picture/mon-fichier.jpg
```

## 7. Base de données

Les tables métier principales sont :

- `users`
- `pro_account`
- `services`
- `availability`
- `reservations`
- `notation`
- `images_services_professionals`

## 8. Nettoyage déjà fait

Les éléments suivants ne font plus partie du runtime actif :

- ancien front HTML dans `views/`
- anciens scripts/styles legacy dans `public/js/` et `public/css/`
- messagerie temps réel Socket.IO
- ancienne config Firebase

## 9. Point d'attention

Le front actif est maintenant `client/`. Si on ajoute une nouvelle page UI, elle doit être faite côté React et branchée via le shell React, pas via un rendu HTML séparé côté serveur.
