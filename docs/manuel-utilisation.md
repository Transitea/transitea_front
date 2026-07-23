# Manuel d'utilisation — Transitea

Ce manuel décrit les fonctionnalités du logiciel Transitea du point de vue de l'utilisateur final, pour le critère C2.4.1 du Bloc 2.

## Rôles

Transitea distingue trois rôles, avec des droits croissants :

| Rôle | Description | Accès |
|---|---|---|
| **Agent** | Agent d'agence, saisit et suit les colis au quotidien | Colis, Scanner, Agences, Clients, Suivi, Notifications, Rapports, Paramètres |
| **Responsable d'agence** (`OPERATEUR`) | Même périmètre que l'agent | idem Agent |
| **Administrateur** | Supervise l'ensemble de l'enseigne | Tout ce qui précède + gestion des agences et des utilisateurs |

## Connexion et inscription

- **Connexion** (`/login`) : email + mot de passe. Après 5 échecs consécutifs, le compte est temporairement verrouillé 15 minutes (protection contre les attaques par force brute).
- **Inscription** (`/inscription`) : un agent peut créer lui-même son compte en choisissant son agence de rattachement dans la liste proposée. Les comptes créés ainsi ont automatiquement le rôle Agent.
- Les comptes Administrateur ou Responsable d'agence sont créés uniquement par un administrateur existant (page Utilisateurs, voir plus bas).

## Tableau de bord

Vue d'accueil après connexion : statistiques globales (nombre de colis par statut) et volume de colis traité sur une période, utiles pour un aperçu rapide de l'activité de l'agence.

## Gestion des colis

### Créer un nouveau colis

Page « Nouveau colis » : formulaire de saisie (expéditeur, destinataire, agence de dépôt et de retrait, poids, description). À la création, un code de tracking unique est généré (format `TRA-AAAA-XXXXXX`) et un QR code lui est associé.

### Consulter et filtrer les colis

Page « Colis » : liste paginée, filtrable par statut et par recherche libre (code, ville, nom de client). Chaque ligne ouvre le détail du colis.

### Suivre le cycle de vie d'un colis

Un colis progresse selon les statuts suivants (une transition en arrière n'est jamais possible) :

```
ENREGISTRE → EN_TRANSIT → ARRIVE_AGENCE → RETIRE
                ↓               ↓
             (aucune)        REFUSE → RETOUR_EXPEDITEUR
```

- `RETIRE` et `RETOUR_EXPEDITEUR` sont des statuts terminaux : aucune action supplémentaire n'est proposée (le bouton « Fermer » remplace l'action de mise à jour).
- Chaque changement de statut déclenche automatiquement une notification (email et/ou WhatsApp) au destinataire.

### Scanner un QR code

Page « Scanner » : utilise la caméra de l'appareil (ou une saisie manuelle du code) pour deux usages :
- **Retrait d'un colis** : scanner le QR code présenté par le destinataire à l'agence fait passer le colis de `ARRIVE_AGENCE` à `RETIRE`.
- **Mise à jour de statut** : depuis le détail d'un colis, un changement de statut peut aussi être déclenché manuellement (bouton « Mettre à jour le statut »).

### Générer / afficher le QR code d'un colis

Depuis le détail d'un colis : bouton « Afficher le QR code », pour l'imprimer ou le transmettre au destinataire.

### Exporter les colis

Un export CSV des colis (filtré par période) est disponible depuis la page Colis.

### Supprimer un colis

Suppression logique uniquement (le colis disparaît des listes mais reste conservé en base pour la traçabilité).

## Suivi public d'un colis (sans compte)

Page `/suivi`, accessible sans connexion : le destinataire (ou toute personne disposant du code de tracking, reçu par email ou WhatsApp) saisit le code pour consulter le statut actuel et l'historique du colis, sans voir d'information sensible sur les autres parties.

## Agences

Page « Agences » : liste des agences de l'enseigne. La création d'une nouvelle agence est réservée aux administrateurs.

## Gestion des utilisateurs (administrateurs uniquement)

Page « Utilisateurs » : liste des comptes de l'enseigne, création de nouveaux comptes (avec choix du rôle), activation/désactivation d'un compte existant. Un compte désactivé ne peut plus se connecter.

## Notifications

Page « Notifications » : historique des notifications (email/WhatsApp) envoyées pour les colis de l'utilisateur, avec leur statut d'envoi.

## Rapports

Page « Rapports » : visualisation du volume de colis traité sur une période sélectionnée.

## Paramètres

Page « Paramètres » : affiche les informations du profil connecté (nom, rôle, agence, email, téléphone) en lecture seule — leur modification n'est pas encore disponible et nécessite de contacter un administrateur. Les sections « Synchronisation hors-ligne » et « Notifications » présentent les préférences par défaut de l'application ; ces réglages ne sont pas encore rendus configurables par l'utilisateur dans cette version.

## Fonctionnement hors-ligne

L'application continue de fonctionner sans connexion réseau pour les opérations essentielles (création de colis, consultation de la liste des agences en cache) : les données sont mises en file d'attente localement et synchronisées automatiquement dès que la connexion revient. Un indicateur en bas de l'écran affiche l'état de connexion et le nombre d'éléments en attente de synchronisation.
