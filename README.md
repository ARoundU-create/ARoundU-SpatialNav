# ARoundU-SpatialNav
Project files of the ARoundU SpatialNav

# 👓 AroundU Spatial Anchor Indoor Navigation (Snap Spectacles | Lens Studio)

A spatial AR navigation system built using **Snapchat's Lens Studio** for **Spectacles**. This project enables indoor navigation using spatial anchors, allowing users to place anchors in their environment and visually navigate between them using arrows and metadata.

---

## 🧭 Features

- Create and persist anchors using **Snap Spatial Anchors**
- View anchor metadata (name, creator, type)
- Visual pathfinding between anchors

---

## 🗂️ Project Structure

- ├── Assets/ # Project assets: anchor prefabs, arrow objects, UI
- ├── Cache/ # Lens Studio temporary files (auto-generated)
- ├── jsconfig.json # JavaScript project config
- ├── Packages/ # Lens Studio packages or modules
- ├── PluginsUserPreferences/ # Editor preferences (user-specific)
- ├── Spatial Anchor.lsproj # 🚀 Main Lens Studio project file
- ├── Support/ # Scripts, prefabs, utilities
- ├── tsconfig.json # TypeScript configuration for Lens Studio
- ├── Workspaces/ # Scene and layout setup


> ✅ **Open `Spatial Anchor.lsproj` in Lens Studio** to get started

---

## 🚀 How to Use

### Step 1: Download the Project
```bash
You will have to install git lfs to clone this file
[git clone https://github.com/your-username/spatial-anchor-navigation.git](https://github.com/ARoundU-create/ARoundU-SpatialNav)
cd spatial-anchor-navigation
Step 2: Open in Lens Studio
Install Lens Studio

Open the project by double-clicking:

Spatial Anchor.lsproj

Step 3: Preview and Test
Use the Preview Panel in Lens Studio to simulate anchor placement.

Use Pinch gestures or Tap (depending on how anchor placement is triggered) to place anchors.

Step 4: Deploy to Spectacles
Connect your Spectacles via USB or Bluetooth

In Lens Studio:

Go to Project Info → Devices

Select Spectacles 2021 or later

Hit Push to Device

Test anchor placement and path visualization in a real indoor space.

📷 Requirements
Snapchat Lens Studio 4.40+

Spectacles 2021 or newer

Optional: External physical markers or QR codes for alignment

🛠️ Contributors
Lead Developer: [Your Name]

AR UI/UX: [Name]

Testing & Deployment: [Name]

Anchor Logic: [Name]

🧭 Future Plans
Multi-level indoor navigation

Cloud-based anchor persistence

Voice-guided navigation (Spectacles audio)

Anchor search and filtering by type



---
