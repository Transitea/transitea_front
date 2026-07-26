# --- Etape 1 : build de l'application (Vite) ---
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Etape 2 : service statique via nginx ---
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Valeur par defaut si API_BACKEND_URL n'est pas fournie au conteneur (prod)
ENV API_BACKEND_URL=http://api.transitea.fr

EXPOSE 80
