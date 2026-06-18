# Planifi

Planifi est une application de prise de rendez-vous qui repose aujourd'hui sur un backend Express + PostgreSQL et un front React compilé avec Vite.

## Stack actuelle

- Backend : Node.js + Express
- Frontend : React + Vite
- Base de données : PostgreSQL
- Authentification : JWT en cookie + `express-session`
- Uploads : `multer` avec stockage local dans `public/uploads`
- UI calendrier : FullCalendar côté React

## Scripts utiles

```bash
npm run dev:server
npm run dev:client
npm run dev:full
npm run build:client
```

## Routes front principales

- `/`
- `/connexion/`
- `/inscription/`
- `/navigation`
- `/services`
- `/app/reservation`
- `/app/calendar`
- `/app/profil`
- `/app/profil/professionnel`

## Notes de structure

- `app.js` démarre Express et expose le build React.
- `client/` contient tout le front actuel.
- `routes/` et `controllers/` portent l'API métier.
- `public/uploads/` stocke les images uploadées.

## État du projet

L'ancien front HTML a été retiré du flux principal. Les anciennes URLs encore utiles sont redirigées vers les routes React pour garder une transition propre.
