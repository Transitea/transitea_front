# Architecture — Atomic Design

Les composants suivent la méthodologie **Atomic Design** (Brad Frost), du plus petit
au plus grand. Chaque niveau ne compose que des éléments du même niveau ou des niveaux
inférieurs.

## Niveaux

| Niveau | Dossier | Rôle | Exemples |
|--------|---------|------|----------|
| ⚛️ Atoms | `components/atoms` | Plus petit élément UI, indivisible, sans logique métier | `Button`, `Input`, `Label`, `Icon`, `Avatar` |
| 🧬 Molecules | `components/molecules` | Quelques atoms assemblés en un groupe fonctionnel | `SearchBar`, `FormField`, `Card` |
| 🦠 Organisms | `components/organisms` | Sections complexes et autonomes de l'interface | `Navbar`, `PostCard`, `Sidebar`, `Footer` |
| 📑 Pages | `src/pages` | Vraies données + logique + routing, assemble des organisms | `HomePage`, `ProfilePage` |

> Pas de niveau `templates` : les pages gèrent leur propre mise en page. Si des layouts
> réutilisables apparaissent, créer un dossier `src/layouts`.

## Convention par composant

Un **dossier par composant**, avec co-location des fichiers liés :

```
atoms/
  Button/
    Button.tsx          # le composant
    Button.module.css   # ses styles (optionnel)
    Button.test.tsx     # ses tests (optionnel)
    index.ts            # ré-export : export { Button } from './Button'
```

Cela permet des imports propres :

```ts
import { Button } from '@/components/atoms/Button'
```

## Règle de dépendance

Une molecule peut importer des atoms. Un organism peut importer molecules + atoms.
Une page peut importer tout. **Jamais l'inverse** : un atom n'importe jamais une molecule.
