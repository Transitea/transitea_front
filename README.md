# Transitea — Frontend

Application web (PWA) de suivi de colis, **offline-first**. React 19 / TypeScript / Vite.

## Prérequis

- Node.js 22+
- npm

## Lancer en local (mode développement)

1. Installer les dépendances :

   ```bash
   npm install
   ```

2. S'assurer que le backend tourne sur `http://localhost:8080` (voir [../transitea_core/transitea/README.md](../transitea_core/transitea/README.md)).

3. Lancer le serveur de développement :

   ```bash
   npm run dev
   ```

   Application disponible sur http://localhost:5173 — le serveur Vite proxifie automatiquement les appels `/api` vers `http://localhost:8080` (voir `vite.config.ts`), aucune configuration supplémentaire n'est nécessaire.

### Tester le scan QR depuis un smartphone (HTTPS requis)

```bash
npm run dev:phone
```

Expose le serveur sur le réseau local en HTTPS (certificat auto-signé) : nécessaire car l'accès à la caméra (`getUserMedia`) exige un contexte sécurisé en dehors de `localhost`.

## Build de production

```bash
npm run build
```

Génère les fichiers statiques dans `dist/` (vérification TypeScript incluse via `tsc -b`).

```bash
npm run preview
```

Sert le build de `dist/` localement sur http://localhost:4173 pour vérifier le résultat avant déploiement.

## Tests et lint

```bash
npm run test    # vitest
npm run lint    # eslint
```

## Lancer en Docker

```bash
docker build -t transitea-front .
docker run -p 8081:80 transitea-front
```

Construit l'application (Node 22) puis sert les fichiers statiques via nginx (`nginx:1.27-alpine`) sur http://localhost:8081.

> ⚠️ La configuration nginx embarquée dans l'image (`default.conf`) proxifie `/api/` vers `api.transitea.fr`, le domaine du backend en **production** — elle ne fonctionne donc pas pour joindre un backend local. Pour tester le conteneur frontend contre un backend lancé en local (voir [../transitea_core/transitea/README.md](../transitea_core/transitea/README.md)), monter à la place `nginx.local.conf` (fourni dans ce dossier, cible le conteneur `transitea-back` par son nom) et rattacher le conteneur au même réseau Docker que le backend :
>
> ```bash
> docker network create transitea-net   # une seule fois
> docker run -d --name transitea-front --network transitea-net -p 8081:80 \
>   -v "$(pwd)/nginx.local.conf:/etc/nginx/conf.d/default.conf:ro" \
>   transitea-front
> ```
>
> Voir [../LANCEMENT_LOCAL.txt](../LANCEMENT_LOCAL.txt) pour la procédure complète (BDD + backend + frontend sur le même réseau). Le nom de conteneur (et non `host.docker.internal`) est utilisé volontairement : `host.docker.internal` ne fonctionne que sur Docker Desktop (Windows/Mac) et pas sur un Docker natif (ex. WSL2 sans Docker Desktop).

## Accès de test

Une fois le frontend et le backend lancés (celui-ci avec le profil `SPRING_PROFILES_ACTIVE=dev`, voir [../transitea_core/transitea/README.md](../transitea_core/transitea/README.md)), se connecter sur la page de login avec l'un des comptes de démonstration :

| Rôle | Email | Mot de passe |
|---|---|---|
| ADMIN | `admin@transitea.fr` | `admin123` |
| OPERATEUR | `operateur@transitea.fr` | `operateur123` |
| AGENT | `agent@transitea.fr` | `agent123` |

## Structure du code

- `src/pages`, `src/layouts`, `src/router` — pages et navigation
- `src/services` — appels API (`api.ts` + un fichier par ressource : `colisApi.ts`, `authApi.ts`, ...)
- `src/offline` — logique offline-first (Dexie / IndexedDB, synchronisation)
- `src/auth` — authentification (JWT)
