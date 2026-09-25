# Beauty Success — boutique de parfums & coffrets

Boutique e-commerce de parfumerie : parfums femme, homme, unisexes, coffrets, nouveautés et promotions.
Direction artistique « broadsheet » inspirée de D.S. & Durga : toile crème, encre noire, typographie
géante, angles vifs, aucune ombre — avec un doré très discret réservé aux détails.

> Site de démonstration : les **marques et produits sont fictifs** et les **visuels sont générés en SVG**
> par l'application (aucune image externe, aucune image issue d'un site tiers).

## Prérequis

- Node.js **22.18 ou plus récent** (LTS 24 recommandée) et npm

## Lancer le projet

```bash
npm install        # installe les dépendances
npm run dev        # serveur de développement → http://localhost:5173
```

| Commande            | Rôle                                                              |
| ------------------- | ----------------------------------------------------------------- |
| `npm run dev`       | Serveur de développement avec rechargement à chaud                |
| `npm run build`     | Vérification TypeScript puis build de production dans `dist/`     |
| `npm run preview`   | Sert le build de production localement                            |
| `npm run typecheck` | Vérification TypeScript seule                                     |
| `npm run lint`      | Analyse du code (Oxlint : React, TypeScript, accessibilité)       |
| `npm run sitemap`   | Régénère `public/sitemap.xml` (`SITE_URL=https://… npm run sitemap`) |

## Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · React Router 8 (mode data, pages chargées à la demande) ·
Lucide React · police Manrope (substitut libre de Sofia Pro).

## Structure

```
src/
├── App.tsx / main.tsx / router.tsx   Point d'entrée et routes
├── index.css                         Design system (tokens Tailwind, animations, effets de survol)
├── config/                           Règles de la boutique (livraison, codes promo…) et du site
├── types/                            Types TypeScript (produit, panier, commande, catalogue, visuels)
├── data/                             Données locales : 40 produits, marques, collections, navigation, contenus
├── services/api.ts                   API simulée (latence) — seul fichier à remplacer pour un vrai backend
├── context/                          État global : panier, favoris, toasts, compte client
├── hooks/                            useProducts, useCatalogParams, useSeo, useInView, useFocusTrap…
├── utils/                            Recherche, filtres/tri, prix, SEO (JSON-LD), validation, formatage
├── components/
│   ├── art/        Générateur de visuels produits SVG (4 vues : studio, clair-obscur, détail, étui)
│   ├── layout/     Header, méga-menu, menu mobile, footer, préchargeur, curseur, barre de progression
│   ├── product/    ProductCard, ProductGrid, ProductCarousel, ProductGallery, OlfactoryPyramid…
│   ├── catalog/    CatalogView, FilterPanel, tri et filtres actifs
│   ├── cart/       CartDrawer, CartLine, OrderSummary, PromoCodeForm, FreeShippingProgress
│   ├── search/     SearchOverlay (recherche instantanée)
│   ├── home/       Sections de l'accueil
│   └── ui/         Boutons, liens fantômes, tiroirs, accordéons, toasts, compteurs, formulaires…
└── pages/          Home, Shop, Category, Product, Search, Cart, Checkout, Favorites, Account, Info, 404
```

## Routes

`/` · `/shop` · `/shop/femme` · `/shop/homme` · `/shop/unisexe` · `/shop/coffrets` · `/shop/nouveautes` ·
`/shop/promotions` · `/shop/meilleures-ventes` · `/shop/luxe` · `/shop/accessibles` · `/product/:id` ·
`/search?q=` · `/cart` · `/checkout` · `/favoris` · `/compte` · `/aide/:page` · 404

Les filtres, le tri et la pagination sont stockés dans l'URL, par exemple
`/shop/coffrets?genre=homme&prix=50-100&tri=prix-croissant`.

## Fonctionnalités

- **Catalogue** : filtres à facettes réels (catégorie, genre, marque, prix, famille olfactive, disponibilité)
  avec compteurs dynamiques, tri (pertinence, prix, nouveautés, meilleures ventes, notes), chargement progressif.
- **Recherche** instantanée (touche `/`) : insensible aux accents et aux pluriels, tolère les fautes de frappe,
  pondère nom > marque > famille > notes. Page de résultats filtrable.
- **Fiche produit** : galerie 4 vues avec zoom au survol, notes olfactives, stock, quantité, favoris,
  produits similaires, vus récemment, barre d'achat collante sur mobile.
- **Panier** : tiroir latéral + page panier, quantités, suppression avec « Annuler », livraison offerte dès 60 €,
  codes promo (`BIENVENUE10`, `SILLAGE15` dès 100 €), persistance locale et synchronisation entre onglets.
- **Commande** en 3 étapes validées (coordonnées, livraison, paiement simulé) et confirmation.
- **Favoris**, **compte client simulé** avec historique des commandes, pages d'aide.
- **Animations** : préchargeur, titres révélés mot à mot, apparitions au défilement, méga-menu, visuels
  qui changent au survol, bouchons qui se soulèvent, brume, reflets, bandeaux défilants, parallaxe, boutons
  magnétiques, curseur contextuel — toutes désactivées si l'utilisateur préfère réduire les animations.
- **Accessibilité** : HTML sémantique, lien d'évitement, focus visible et piégé dans les tiroirs, libellés,
  `aria-live`, navigation clavier complète, contrastes AA.
- **SEO** : titre, description, Open Graph et URL canonique par page, H1 unique, données structurées JSON-LD
  (Product, BreadcrumbList, ItemList, Organization, WebSite + SearchAction), `robots.txt`, `sitemap.xml`.

## Brancher un vrai backend

1. **Produits** : remplacer le corps de `fetchProducts()` dans `src/services/api.ts` par un appel `fetch`.
   Le type `Product` correspond déjà à une réponse d'API. Mettre de vraies URL dans `image` / `images` :
   `ProductImage` affiche alors des `<img>` (chargement différé) et le générateur SVG n'est plus utilisé.
2. **Recherche et filtres** : actuellement côté client (`utils/search.ts`, `utils/catalog.ts`) ; à déporter
   vers l'API ou un moteur (Algolia, Meilisearch…) pour un gros catalogue, en gardant les paramètres d'URL.
3. **Panier** : `context/CartProvider.tsx` persiste en localStorage — à synchroniser avec une API panier
   (le format `CartItem` est un instantané prêt à l'emploi). Vérifier stock et prix côté serveur.
4. **Commande et paiement** : `submitOrder()` est simulé — brancher un PSP (Stripe, Adyen, PayPlug…) avec
   ses composants hébergés (ne jamais faire transiter les numéros de carte par votre serveur).
5. **Compte client** : `AccountProvider` est simulé — à remplacer par une authentification réelle (sessions/JWT).
6. **Newsletter**, **codes promo** (`config/shop.ts`), **frais de port** : à gérer côté serveur.
7. **SEO en production** : définir `VITE_SITE_URL` (voir `.env.example`), générer le sitemap avec `SITE_URL`,
   et envisager un pré-rendu/SSR pour l'indexation. Ajouter une image Open Graph (PNG/JPG).

## Déploiement

Application monopage : configurer l'hébergeur pour renvoyer `index.html` sur toutes les routes
(Netlify : `/* /index.html 200` ; Vercel : rewrite vers `/index.html` ; Nginx : `try_files $uri /index.html`).
