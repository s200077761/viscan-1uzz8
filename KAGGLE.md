# 📊 Kaggle Dataset Setup

## Creating ViScan on Kaggle

### Dataset Info
- **Username**: (your Kaggle username)
- **Dataset**: viscan-iris-analysis-data
- **Type**: Code + Dataset

---

## Option 1: Kaggle Dataset (Iridology Data)

### Steps:

1. **Go to**: https://www.kaggle.com/datasets

2. **Click**: "New Dataset"

3. **Upload Files**:
   - `iridologyZones.json`
   - Sample iris images (if you have any)
   - Documentation

4. **Dataset Info**:
```
Title: Iridology Zone Mapping for Iris Analysis
Subtitle: Bernard Jensen iridology charts and zone data
Description:
This dataset contains comprehensive iridology zone mapping data based on 
Bernard Jensen's work. Includes 20+ zones mapped to organs and body systems.

Tags: healthcare, medical, iridology, computer-vision, health
```

---

## Option 2: Kaggle Notebook (Code Demo)

### Steps:

1. **Go to**: https://www.kaggle.com/code

2. **Click**: "New Notebook"

3. **Create Notebook**:

```python
# ViScan - Iris Analysis Demo
# Educational iridology analysis

import json
import pandas as pd
from pathlib import Path

# Load iridology zones data
with open('iridologyZones.json', 'r', encoding='utf-8') as f:
    zones = json.load(f)

# Convert to DataFrame
zones_df = pd.DataFrame(zones)
print(f"Total zones: {len(zones_df)}")
print("\nZone categories:")
print(zones_df['category'].value_counts())

# Display sample zones
zones_df.head(10)
```

4. **Add Data**:
   - Upload `iridologyZones.json` as input

5. **Publish**:
   - Title: "ViScan: Iris Analysis with Iridology Mapping"
   - Make public

---

## Preparing Files for Kaggle

Run these commands to prepare:

```bash
cd /Users/sheelamcompany/viscan-1uzz8

# Create Kaggle directory
mkdir -p kaggle-dataset

# Copy data files
cp src/data/iridologyZones.json kaggle-dataset/

# Create dataset metadata
cat > kaggle-dataset/dataset-metadata.json << 'EOF'
{
  "title": "Iridology Zone Mapping for Iris Analysis",
  "id": "YOUR_USERNAME/iridology-zones",
  "licenses": [
    {
      "name": "apache-2.0"
    }
  ],
  "keywords": [
    "healthcare",
    "medical",
    "iridology",
    "health",
    "computer-vision"
  ],
  "resources": [
    {
      "path": "iridologyZones.json",
      "description": "Complete iridology zone mappings"
    }
  ]
}
EOF

# Create README
cat > kaggle-dataset/README.md << 'EOF'
# Iridology Zone Mapping Dataset

## Overview
This dataset contains iridology zone mapping data based on Bernard Jensen's 
charts, used for iris analysis in the ViScan application.

## Content
- **iridologyZones.json**: Complete zone data with health indicators
- 20+ body zones mapped to iris regions
- Health indicators and recommendations per zone

## Usage
```python
import json
with open('iridologyZones.json', 'r') as f:
    zones = json.load(f)
```

## Application
Part of the ViScan iris analysis system: https://viscan.app

## Disclaimer
Educational purposes only. Not for medical diagnosis.

## License
Apache 2.0
EOF
```

---

## Upload via Kaggle CLI

```bash
# Install Kaggle CLI
pip install kaggle

# Configure (place API token in ~/.kaggle/kaggle.json)

# Create dataset
cd /Users/sheelamcompany/viscan-1uzz8/kaggle-dataset
kaggle datasets create -p .

# Update dataset
kaggle datasets version -p . -m "Updated zone mappings"
```

---

## Manual Upload Steps

1. **Compress files**:
```bash
cd /Users/sheelamcompany/viscan-1uzz8/kaggle-dataset
zip -r iridology-zones.zip *
```

2. **Upload to Kaggle**:
   - Go to https://www.kaggle.com/datasets
   - Click "New Dataset"
   - Drag & drop `iridology-zones.zip`
   - Fill in metadata
   - Click "Create"

---

## Alternative: Full Project on Kaggle

You can also upload the entire codebase as a Kaggle Notebook project!

**Benefits**:
- Version control
- Public portfolio
- Community engagement
- Citation tracking
