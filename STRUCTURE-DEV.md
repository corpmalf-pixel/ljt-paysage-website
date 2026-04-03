# 🏗️ Structure Development - LJT Paysage

## 📁 Structure Repo Optimisée

```
ljt-paysage-website/
├── 📂 src/                    # Source development
│   ├── index.html            # HTML principal
│   ├── styles.css            # CSS principal
│   └── script.js             # JS principal
├── 📂 assets/                # Médias & ressources
│   ├── 📸 images/            # UPLOAD TES PHOTOS ICI
│   │   ├── gallery/          # Projets réalisés
│   │   ├── team/             # Photos équipe
│   │   ├── logo/             # Logos LJT
│   │   └── icons/            # Icônes UI
│   ├── 🎥 videos/            # Vidéos projets
│   └── 🔤 fonts/             # Polices custom
├── 📂 dist/                  # Build production (auto)
├── 📂 docs/                  # Documentation
├── 📂 scripts/               # Scripts build/deploy
└── 📂 public/                # Assets statiques

## 🎯 Workflow Upload Photos

### 1. Télécharge photos dans :
- `assets/images/gallery/` → Photos projets/jardins
- `assets/images/team/` → Photos équipe LJT
- `assets/images/logo/` → Logos entreprise

### 2. Formats optimaux :
- **Photos :** JPG/JPEG (max 1920px, <2MB)
- **Logos :** PNG/SVG (fond transparent)
- **Vidéos :** MP4/WebM (max 10MB)

### 3. Nommage conseillé :
```bash
# Projets
gallery-jardin-moderne-01.jpg
gallery-terrasse-premium-02.jpg
gallery-arrosage-automatique-03.jpg

# Équipe
team-laurent-paysagiste.jpg
team-marie-designer.jpg

# Logos
logo-ljt-main.png
logo-ljt-white.svg
```

## 🚀 Commandes Dev

```bash
# Développement local
npm run dev

# Build production
npm run build

# Deploy Vercel
npm run deploy

# Optimise images
npm run optimize
```

## 📋 Étapes Upload & Deploy

1. **Upload photos** → `assets/images/`
2. **Commit changes** → `git add . && git commit`
3. **Build production** → `npm run build`
4. **Deploy Vercel** → `npm run deploy`
5. **URL live** → https://ljt-paysage-website-omega.vercel.app

## 💡 Tips Performance

- Compresse images avant upload (TinyPNG)
- Utilise WebP si possible
- Videos max 10MB
- Teste mobile-first

---

**Ready for upload ! 🎯**