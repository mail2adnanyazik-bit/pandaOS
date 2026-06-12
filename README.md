# pandaOS – A Arch Linux/Terminal inspired Web Operating System

pandaOS is a fully functional, browser‑based operating system interface built with vanilla HTML, CSS, and JavaScript. It features a draggable window manager, a dock, a start menu, a global spotlight search, and a suite of built‑in apps – all styled with a dark, neon‑blue, terminal aesthetic.

---

## Features

- **Boot & login sequence** – Terminal‑style boot messages, then a login prompt (`panda` / `UseNvim`). After first login, the OS remembers you.
- **Draggable windows** – Move any window by its title bar; positions and sizes are saved in `localStorage`.
- **Dock** (macOS‑style) – Centered, auto‑hides, with custom icons and hover tooltips.
- **Start menu** – Opens above the `$ pandaOS` button; contains Terminal, Panda Profile, and Settings.
- **Right‑click desktop** – Shows the same menu at cursor position.
- **Spotlight search** – `Ctrl+K` anywhere to search and launch apps.
- **Workspace persistence** – Window positions, dock auto‑hide state, terminal font size, window opacity, and volume are saved.
- **Customizable settings** – Adjust window transparency, terminal font size, and master volume; dock auto‑hide toggles.

---

## Built‑in Apps

| App               | Description                                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Terminal**      | Interactive command line with `help`, `clear`, `date`, and commands to open other apps.                                                                            |
| **Projects**      | Displays your GitHub repositories (pandaVim, filesort, NeoFolio, pandaOS).                                                                                         |
| **Panda Profile** | Your avatar, name, badges, and social links (same as portfolio about page).                                                                                        |
| **Music Player**  | Play your own MP3s with playlist, seek bar, play/pause, next/prev, and volume sync.                                                                                |
| **Calculator**    | Full arithmetic calculator with expression display, keyboard support, and visual operator feedback.                                                                |
| **Notes**         | Split‑view markdown editor with live preview, local storage save/load, and markdown syntax (bold, italic, headings, highlight, strikethrough, lists, code, links). |
| **Settings**      | Tabbed settings for volume (syncs with dock), window opacity, terminal font size, dock auto‑hide, and keyboard shortcuts.                                          |

---

## Keybinding for Search

`Ctrl+K` : Open Spotlight search (type app name, `Enter` to launch) |
Right‑click (desktop) : Open start menu at cursor |

## Project Structure

pandaOS/
├── index.html
├── css/
│ ├── reset.css
│ ├── desktop.css
│ ├── windows.css
│ ├── boot.css
│ └── apps.css
├── js/
│ ├── utils.js
│ ├── drag.js
│ ├── desktop.js
│ ├── boot.js
│ ├── spotlight.js
│ └── apps/
│ ├── terminal.js
│ ├── projects.js
│ ├── profile.js
│ ├── music.js
│ ├── calculator.js
│ ├── notes.js
│ └── settings.js
├── assets/
│ ├── icons/  
│ ├── music/  
│ └── wallpaper/  
└── README.md

## Used :

    - Pure HTML5, CSS3, JavaScript (ES6) – no frameworks or external libraries.

    - LocalStorage for persistence (window positions, settings, notes, brightness – brightness removed in final version, but opacity, font size, dock auto‑hide remain).

    -  Web Audio API for music playback.

    - CSS Grid and Flexbox for layouts.

    - Custom drag‑and‑drop implementation.
