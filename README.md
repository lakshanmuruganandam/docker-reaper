<div align="center">

# 🐳 Docker Reaper

> **Interactively hunt down and obliterate dead Docker containers and dangling images eating your hard drive.**

[![npm version](https://badge.fury.io/js/docker-reaper.svg)](https://www.npmjs.com/package/docker-reaper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

```text
    ██████╗  ██████╗  ██████╗██╗  ██╗███████╗██████╗
    ██╔══██╗██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
    ██║  ██║██║   ██║██║     █████╔╝ █████╗  ██████╔╝
    ██║  ██║██║   ██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
    ██████╔╝╚██████╔╝╚██████╗██║  ██╗███████╗██║  ██║
    ╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
    ██████╗ ███████╗ █████╗ ██████╗ ███████╗██████╗ 
    ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗
    ██████╔╝█████╗  ███████║██████╔╝█████╗  ██████╔╝
    ██╔══██╗██╔══╝  ██╔══██║██╔═══╝ ██╔══╝  ██╔══██╗
    ██║  ██║███████╗██║  ██║██║     ███████╗██║  ██║
    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝
```

Docker is infamous for silently eating up 50GB+ of hard drive space with dead, exited containers and dangling `<none>:<none>` images. 

**Docker Reaper** is a beautiful, interactive CLI that scans your Docker daemon, lists out all the dead weight, and lets you visually mass-delete them to instantly reclaim your disk space.

## ✨ Features

- **🐳 Full Environment Scan:** Instantly fetches all exited containers and dangling, untagged images.
- **⚡ Mass Obliteration:** Interactively select as many resources as you want using the Spacebar, or press `a` to nuke everything at once.
- **🛡️ Safe Deletion:** Won't touch your running containers or tagged images.
- **🎨 Premium UX:** Built with `inquirer` for a buttery-smooth terminal experience, complete with custom ASCII art.

## 🚀 Installation

Run it instantly anywhere without installing:

```bash
npx docker-reaper
```

Or install it globally to keep your storage clean forever:

```bash
npm install -g docker-reaper
```

## 🎮 Usage

Run the command:

```bash
docker-reaper
```

### Controls:
- **`↑ / ↓`** : Navigate the list of resources.
- **`Space`** : Select targets to delete.
- **`a`** : Select ALL targets.
- **`i`** : Invert selection.
- **`Enter`** : Proceed to deletion.

---

### Architected by [@lakshanmuruganandam](https://github.com/lakshanmuruganandam)
*Because `docker system prune` is boring.*
