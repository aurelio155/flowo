# Déployer Flowo en ligne

## Étape 1 — Créer un compte Vercel (gratuit)
Aller sur https://vercel.com → Sign Up (avec GitHub)

## Étape 2 — Pousser le code sur GitHub
1. Créer un repo sur https://github.com/new
2. Dans ce dossier, ouvrir un terminal et taper :
```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON_NOM/flowo.git
git push -u origin main
```

## Étape 3 — Déployer sur Vercel
1. Sur Vercel → "New Project" → Import depuis GitHub → sélectionner "flowo"
2. Dans "Environment Variables", ajouter :
   - DATABASE_URL → utiliser Turso (voir étape 4)
   - NEXT_PUBLIC_URL → ton URL Vercel (ex: https://flowo.vercel.app)
   - JWT_SECRET → une clé secrète longue et aléatoire

## Étape 4 — Base de données en production (Turso — gratuit)
Turso est compatible avec notre adapter SQLite.
1. Aller sur https://turso.tech → créer un compte
2. Créer une base de données
3. Dans le dashboard Turso, copier l'URL (libsql://xxx.turso.io)
4. Générer un token d'authentification
5. Le DATABASE_URL sera : libsql://xxx.turso.io?authToken=TON_TOKEN

## Étape 5 — Lancer la migration en production
Depuis ton terminal local, avec les variables Turso :
```
DATABASE_URL="libsql://xxx.turso.io?authToken=TON_TOKEN" npx prisma migrate deploy
```

## C'est en ligne ! 🎉
Ton Flowo sera accessible sur https://flowo.vercel.app (ou ton domaine personnalisé)

## Domaine personnalisé (optionnel)
Sur Vercel → Settings → Domains → Ajouter flowo.io (ou ton domaine)
