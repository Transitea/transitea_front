# Transitea — Frontend

Application web (PWA) de suivi de colis, **offline-first**. React 19 / TypeScript / Vite.

> Pour lancer l'application complète (backend + frontend + BDD) en une seule commande, voir le [README à la racine du dépôt](../README.md).

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

> ⚠️ La configuration nginx embarquée dans l'image (`default.conf`) proxifie `/api/` vers `api.transitea.fr`, le domaine du backend en **production**. Lancée seule avec cette commande, l'image ne pourra donc pas joindre un backend local. Pour un lancement 100 % local avec le backend aussi dockerisé, utiliser plutôt le `docker-compose.yml` à la racine du dépôt, qui monte une configuration nginx adaptée au réseau Docker local (voir [../README.md](../README.md)).

## Structure du code

- `src/pages`, `src/layouts`, `src/router` — pages et navigation
- `src/services` — appels API (`api.ts` + un fichier par ressource : `colisApi.ts`, `authApi.ts`, ...)
- `src/offline` — logique offline-first (Dexie / IndexedDB, synchronisation)
- `src/auth` — authentification (JWT)
