(function () {
  const startBtn = document.getElementById("start-button");
  const startMenu = document.getElementById("start-menu");
  const windowsContainer = document.getElementById("windows-container");
  const taskbarWindows = document.getElementById("taskbar-windows");

  const openWindows = new Map();
  let isStartMenuOpen = false;

  function closeStartMenu() {
    startMenu.classList.add("hidden");
    isStartMenuOpen = false;
  }

  function openStartMenu() {
    startMenu.classList.remove("hidden");
    isStartMenuOpen = true;
  }

  function createWindow(appId, title, contentHtml, width = 500, height = 400) {
    if (openWindows.has(appId)) {
      const existing = openWindows.get(appId).windowEl;
      window.pandaOS.focusWindow(existing);
      return existing;
    }

    const windowEl = document.createElement("div");
    windowEl.className = "window";
    windowEl.id = window.pandaOS.generateID();
    windowEl.setAttribute("data-app-id", appId);

    const savedPos = window.pandaOS.loadWindowPosition(appId);
    if (savedPos) {
      windowEl.style.left = savedPos.left + "px";
      windowEl.style.top = savedPos.top + "px";
      windowEl.style.width = savedPos.width + "px";
      windowEl.style.height = savedPos.height + "px";
    } else {
      windowEl.style.width = width + "px";
      windowEl.style.height = height + "px";
      window.pandaOS.centerWindow(windowEl, width, height);
    }

    const titleBar = document.createElement("div");
    titleBar.className = "window-titlebar";
    titleBar.innerHTML = `
      <span class="window-title">${title}</span>
      <button class="window-close" data-app-id="${appId}">✕</button>
    `;
    windowEl.appendChild(titleBar);

    const contentDiv = document.createElement("div");
    contentDiv.className = "window-content";
    contentDiv.innerHTML = contentHtml;
    windowEl.appendChild(contentDiv);

    windowsContainer.appendChild(windowEl);

    windowEl.style.zIndex = window.pandaOS.getNextZIndex();

    const taskbarIcon = document.createElement("div");
    taskbarIcon.className = "taskbar-window";
    taskbarIcon.textContent = title;
    taskbarIcon.setAttribute("data-app-id", appId);
    taskbarIcon.addEventListener("click", () => {
      window.pandaOS.focusWindow(windowEl);
    });
    taskbarWindows.appendChild(taskbarIcon);

    openWindows.set(appId, { windowEl, taskbarIcon });

    const closeBtn = titleBar.querySelector(".window-close");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeWindow(appId);
    });

    windowEl.addEventListener("mousedown", () => {
      window.pandaOS.focusWindow(windowEl);
    });

    if (apps[appId] && apps[appId].init) {
      setTimeout(() => apps[appId].init(), 50);
    }

    return windowEl;
  }

  function closeWindow(appId) {
    const entry = openWindows.get(appId);
    if (!entry) return;
    entry.windowEl.remove();
    entry.taskbarIcon.remove();
    openWindows.delete(appId);
  }

  const apps = {};
  if (window.pandaOS.calculator) apps.calculator = window.pandaOS.calculator;
  if (window.pandaOS.music) apps.music = window.pandaOS.music;
  if (window.pandaOS.notes) apps.notes = window.pandaOS.notes;
  if (window.pandaOS.projects) apps.projects = window.pandaOS.projects;
  if (window.pandaOS.profile) apps.profile = window.pandaOS.profile;
  if (window.pandaOS.terminal) apps.terminal = window.pandaOS.terminal;
  if (window.pandaOS.settings) apps.settings = window.pandaOS.settings;

  window.pandaOS.openApp = function (appId) {
    const app = apps[appId];
    if (!app) return;
    const content =
      typeof app.getContent === "function" ? app.getContent() : app.content;
    createWindow(appId, app.title, content, app.width, app.height);
  };

  document.querySelectorAll(".start-app").forEach((btn) => {
    const appId = btn.getAttribute("data-app");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.pandaOS.openApp(appId);
      closeStartMenu();
    });
  });

  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const menu = startMenu;
    const rect = startBtn.getBoundingClientRect();
    menu.style.position = "fixed";
    menu.style.left = rect.left + "px";
    menu.style.bottom = window.innerHeight - rect.top + 8 + "px";
    menu.style.top = "auto";
    menu.style.right = "auto";
    if (menu.classList.contains("hidden")) {
      menu.classList.remove("hidden");
      isStartMenuOpen = true;
    } else {
      menu.classList.add("hidden");
      isStartMenuOpen = false;
    }
  });

  document.addEventListener("click", function (e) {
    if (!isStartMenuOpen) return;
    if (startMenu.contains(e.target) || startBtn.contains(e.target)) return;
    closeStartMenu();
  });

  startMenu.addEventListener("click", (e) => e.stopPropagation());

  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const clockEl = document.getElementById("clock");
    if (clockEl) clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    const dateEl = document.getElementById("date");
    if (dateEl) dateEl.textContent = now.toISOString().slice(0, 10);
  }
  updateClock();
  setInterval(updateClock, 1000);

  const volumeSlider = document.getElementById("volume-slider");
  const volumeLevel = document.getElementById("volume-level");

  function updateVolumeUI(value) {
    if (volumeSlider) volumeSlider.value = value;
    if (volumeLevel) volumeLevel.style.width = value + "%";
    if (window.pandaOS) window.pandaOS.masterVolume = value / 100;
    const settingsVolume = document.getElementById("settings-volume");
    if (settingsVolume && settingsVolume.value != value) {
      settingsVolume.value = value;
      const settingsVolSpan = document.getElementById("volume-value");
      if (settingsVolSpan) settingsVolSpan.textContent = value + "%";
    }
  }

  if (volumeSlider && volumeLevel) {
    updateVolumeUI(volumeSlider.value);
    volumeSlider.addEventListener("input", function (e) {
      const val = e.target.value;
      updateVolumeUI(val);
    });
  }

  window.pandaOS.initDesktop = function () {
    const children = document.body.children;
    for (let child of children) {
      if (child.id !== "boot-overlay") {
        child.style.display = "";
      }
    }
  };

  document.querySelectorAll(".dock-icon").forEach((icon) => {
    const appId = icon.getAttribute("data-app");
    icon.addEventListener("click", () => {
      if (window.pandaOS && window.pandaOS.openApp) {
        window.pandaOS.openApp(appId);
      }
    });
  });

  const desktopDiv = document.getElementById("desktop");
  if (desktopDiv) {
    desktopDiv.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const menu = startMenu;
      menu.style.position = "fixed";
      menu.style.left = e.clientX + "px";
      menu.style.top = e.clientY + "px";
      menu.style.bottom = "auto";
      menu.style.right = "auto";
      menu.classList.remove("hidden");
      isStartMenuOpen = true;
      const closeMenu = () => {
        menu.classList.add("hidden");
        isStartMenuOpen = false;
        document.removeEventListener("click", closeMenu);
      };
      setTimeout(() => {
        document.addEventListener("click", closeMenu);
      }, 10);
    });
  }

  document.querySelectorAll(".dock-icon").forEach((icon) => {
    const appId = icon.getAttribute("data-app");
    const tooltips = {
      terminal: "Terminal",
      projects: "Projects",
      profile: "Panda Profile",
      music: "Music Player",
      calculator: "Calculator",
      notes: "Notes",
      settings: "Settings",
    };
    icon.setAttribute("title", tooltips[appId] || appId);
  });

  console.log("pandaOS desktop ready");
})();
