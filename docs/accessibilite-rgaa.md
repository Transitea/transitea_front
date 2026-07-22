# Démarche d'accessibilité — RGAA

Ce document justifie le choix du référentiel d'accessibilité retenu pour le frontend Transitea et présente les résultats de l'audit réalisé, pour le critère C2.2.3 du Bloc 2 (« Le référentiel d'accessibilité choisi est présenté et justifié » / « Le prototype permet de répondre aux exigences du référentiel d'accessibilité préalablement établi »).

## Référentiel choisi : RGAA (Référentiel Général d'Amélioration de l'Accessibilité)

Le RGAA a été retenu plutôt qu'OPQUAST pour deux raisons :
- C'est le référentiel officiel français en matière d'accessibilité numérique, basé sur les normes internationales WCAG 2.1, ce qui en fait la référence la plus reconnue et la plus complète sur ce sujet précis.
- OPQUAST couvre un périmètre plus large (qualité web en général : SEO, ergonomie, sécurité, etc.) mais de façon moins approfondie sur l'accessibilité stricte ; le RGAA est plus exigeant et mieux adapté à une démonstration ciblée des critères d'accessibilité.

Transitea étant un service utilisé par des agents d'agence et des destinataires grand public (page de suivi de colis publique), viser la conformité RGAA garantit l'utilisabilité par des personnes en situation de handicap (visuel, moteur, cognitif) sur les parcours les plus exposés.

## Méthode

1. **Audit automatisé** avec [axe-core](https://github.com/dequelabs/axe-core) (moteur de test utilisé par la plupart des outils RGAA/WCAG du marché), exécuté directement dans le navigateur sur les pages accessibles sans authentification : Connexion, Inscription, Suivi public d'un colis, page 404.
2. **Revue de code ciblée** sur les composants partagés par toutes les pages authentifiées (`AppLayout`, `Topbar`, `Sidebar`) pour vérifier la structure de landmarks et de titres, propagée à l'ensemble de l'application.
3. Corrections appliquées puis audit automatisé relancé pour confirmer la résolution.

**Limite assumée :** l'audit automatisé ne couvre qu'une partie des critères RGAA (structure, contraste, noms accessibles, landmarks). Il ne remplace pas un test manuel complet au clavier et au lecteur d'écran sur l'ensemble des parcours, qui reste à planifier avant une mise en production définitive.

## Résultats de l'audit automatisé

| Page | Violations avant correction | Violations après correction |
|---|---|---|
| Connexion (`/login`) | 0 | 0 |
| Inscription (`/inscription`) | 0 | 0 |
| Suivi public (`/suivi`) | 4 types (contraste, landmark principal manquant, titre H1 manquant, contenu hors landmarks) | 0 |
| Page 404 | 3 types (landmark principal manquant, titre H1 manquant, contenu hors landmarks) | 0 |

## Corrections apportées

- **Contraste insuffisant** : le texte doré du logo sur la page de suivi public passait de 2,7:1 à un ratio conforme AA (~5:1) en utilisant une teinte plus foncée (`#C2410C`) pour ce contexte texte-sur-fond-clair (`SuiviPage.module.css`).
- **Landmark principal manquant** : ajout d'un élément `<main>` sur la page de suivi public, la page 404, et surtout au niveau de la coquille applicative (`AppLayout.tsx`), ce qui couvre automatiquement les 11 pages authentifiées qui s'appuient dessus (Tableau de bord, Colis, Utilisateurs, Rapports, etc.).
- **Titre de niveau 1 manquant** : ajout d'un `<h1>` visible (page 404) ou masqué visuellement mais lisible par lecteur d'écran (`.sr-only`, page de suivi public), et transformation du titre de `Topbar` (utilisé par les 11 pages authentifiées) en véritable `<h1>`.
- **Contenu hors landmarks** : le composant `SyncStatusIndicator`, affiché en permanence en dehors de la zone principale, est désormais rattaché à une région nommée (`role="region" aria-label="Statut de synchronisation"`).
- **Nom accessible manquant sur un champ de recherche** : ajout d'un `aria-label` sur le champ de recherche de la page Colis, qui ne reposait que sur un `placeholder` (non lu de façon fiable par les lecteurs d'écran).
- **Bouton icône avec `title` seul** : le bouton de synchronisation manuelle reposait uniquement sur l'attribut `title` (non garanti par les technologies d'assistance) ; ajout d'un `aria-label` équivalent.

## Points de vigilance restants

- Test manuel au clavier (navigation par tabulation, pièges au focus) non réalisé sur l'ensemble des parcours.
- Test avec un lecteur d'écran réel (NVDA/VoiceOver) non réalisé.
- Les pages authentifiées (Colis, Dashboard, Utilisateurs, etc.) n'ont pas pu être auditées avec axe-core en conditions réelles faute d'environnement backend disponible au moment de l'audit ; les corrections y ont été appliquées par revue de code sur les composants partagés, à confirmer par un nouvel audit automatisé une fois le backend accessible.
