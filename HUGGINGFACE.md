# 🤗 Hugging Face Repository Setup

## Creating ViScan on Hugging Face

### Repository Info
- **Username**: s200077761
- **Repository**: viscan-iris-analysis
- **Type**: Space (for web app demo) or Dataset (for iridology data)

---

## Option 1: Create a Space (Recommended)

Hugging Face Spaces lets you host the live demo!

### Steps:

1. **Go to**: https://huggingface.co/new-space

2. **Fill in**:
   - Owner: `s200077761`
   - Space name: `viscan-iris-analysis`
   - License: `apache-2.0`
   - SDK: `static` (for HTML/JS app)

3. **Clone and Push**:
```bash
# Clone your new space
git clone https://huggingface.co/spaces/s200077761/viscan-iris-analysis
cd viscan-iris-analysis

# Copy public files
cp -r /Users/sheelamcompany/viscan-1uzz8/public/* .

# Create README
cat > README.md << 'EOF'
---
title: ViScan - Iris Analysis System
emoji: 👁️
colorFrom: purple
colorTo: blue
sdk: static
pinned: false
license: apache-2.0
---

# 👁️ ViScan - Iris Analysis System

Advanced iris analysis using iridology mapping techniques.

## Features
- 📸 Image upload with drag & drop
- 🗺️ 20+ zone analysis based on Bernard Jensen charts
- 🎨 Dominant color detection
- 🔍 Pattern recognition
- 📊 Interactive dashboard

## Live Demo
Access the full application: https://viscan.app

## Technology
- PWA (Progressive Web App)
- Firebase Hosting & Functions
- Firestore Database
- Node.js Backend
- Vanilla JavaScript Frontend

## Disclaimer
This application is for educational purposes only. Results are not medical diagnoses.
EOF

# Push to Hugging Face
git add .
git commit -m "Add ViScan PWA demo"
git push
```

---

## Option 2: Create a Dataset

For sharing iridology zone data and sample images.

### Steps:

1. **Go to**: https://huggingface.co/new-dataset

2. **Fill in**:
   - Owner: `s200077761`
   - Dataset name: `iridology-zones`
   - License: `apache-2.0`

3. **Upload Files**:
```bash
git clone https://huggingface.co/datasets/s200077761/iridology-zones
cd iridology-zones

# Copy data
cp /Users/sheelamcompany/viscan-1uzz8/src/data/iridologyZones.json .

# Create dataset card
cat > README.md << 'EOF'
---
license: apache-2.0
task_categories:
- image-classification
- other
tags:
- iridology
- medical
- health
pretty_name: Iridology Zone Mapping Data
size_categories:
- n<1K
---

# Iridology Zone Mapping Dataset

Bernard Jensen iridology zone mappings for iris analysis.

## Content
- `iridologyZones.json`: Complete zone mapping data with health indicators

## Usage
```javascript
const zones = require('./iridologyZones.json');
```

## Citation
Based on Bernard Jensen's Iridology work.
EOF

git add .
git commit -m "Add iridology zone data"
git push
```

---

## Quick Commands

### Create Space:
```bash
cd /tmp
git clone https://huggingface.co/spaces/s200077761/viscan-iris-analysis
cd viscan-iris-analysis
cp -r /Users/sheelamcompany/viscan-1uzz8/public/* .
# Add README (see above)
git add .
git commit -m "Initial commit: ViScan PWA"
git push
```

### View Your Spaces:
https://huggingface.co/s200077761

---

**Note**: You'll need Hugging Face CLI or Git credentials configured.
