window.pandaOS = window.pandaOS || {};

window.pandaOS.settings = {
  title: "Settings",
  width: 650,
  height: 500,
  getContent: () => `
    <div class="settings-container">
      <div class="settings-tabs">
        <button class="settings-tab active" data-tab="volume">Volume</button>
        <button class="settings-tab" data-tab="appearance">Appearance</button>
        <button class="settings-tab" data-tab="terminal">Terminal</button>
        <button class="settings-tab" data-tab="dock">Dock</button>
        <button class="settings-tab" data-tab="help">Help</button>
      </div>
      <div class="settings-content">
        <div id="tab-volume" class="settings-pane active">
          <h3>Volume Control</h3>
          <p>Adjust the master volume (affects music player).</p>
          <input type="range" id="settings-volume" min="0" max="100" value="70">
          <span id="volume-value">70%</span>
        </div>
        <div id="tab-appearance" class="settings-pane">
          <h3>Window Opacity</h3>
          <p>Make windows semi‑transparent (0% = solid, 90% = nearly invisible).</p>
          <input type="range" id="window-opacity" min="0" max="90" value="0" step="5">
          <span id="opacity-value">0%</span>
        </div>
        <div id="tab-terminal" class="settings-pane">
          <h3>Terminal Font Size</h3>
          <p>Adjust terminal font size (12px – 24px).</p>
          <input type="range" id="terminal-font-size" min="12" max="24" value="14" step="1">
          <span id="terminal-font-value">14px</span>
        </div>
        <div id="tab-dock" class="settings-pane">
          <h3>Dock Auto‑hide</h3>
          <p>Automatically hide the dock when not hovering the taskbar.</p>
          <label class="toggle-switch">
            <input type="checkbox" id="dock-autohide">
            <span class="toggle-slider"></span>
          </label>
          <span id="dock-autohide-status">Disabled</span>
        </div>
        <div id="tab-help" class="settings-pane">
          <h3>Keyboard Shortcuts</h3>
          <ul>
            <li><kbd>Ctrl+K</kbd> – Open app search (Spotlight)</li>
            <li>Dock icons – Click to open apps</li>
            <li>Right-click on desktop – Open start menu</li>
            <li>Terminal commands: <kbd>help</kbd>, <kbd>clear</kbd>, <kbd>date</kbd>, <kbd>projects</kbd>, <kbd>profile</kbd>, <kbd>settings</kbd>, <kbd>music</kbd>, <kbd>calculator</kbd>, <kbd>notes</kbd></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  init: function () {
    const checkExist = setInterval(() => {
      const volumeSlider = document.getElementById("settings-volume");
      if (volumeSlider) {
        clearInterval(checkExist);
        this.attachEvents();
      }
    }, 100);
  },
  attachEvents: function () {
    const volumeSlider = document.getElementById("settings-volume");
    const volumeVal = document.getElementById("volume-value");
    if (volumeSlider && volumeVal) {
      const dockVolume = document.getElementById("volume-slider");
      if (dockVolume) volumeSlider.value = dockVolume.value;
      volumeVal.textContent = volumeSlider.value + "%";
      window.pandaOS.masterVolume = volumeSlider.value / 100;
      volumeSlider.addEventListener("input", (e) => {
        const val = e.target.value;
        volumeVal.textContent = val + "%";
        window.pandaOS.masterVolume = val / 100;
        const dockSlider = document.getElementById("volume-slider");
        if (dockSlider && dockSlider.value != val) {
          dockSlider.value = val;
          const dockLevel = document.getElementById("volume-level");
          if (dockLevel) dockLevel.style.width = val + "%";
        }
      });
    }

    const opacitySlider = document.getElementById("window-opacity");
    const opacityVal = document.getElementById("opacity-value");
    if (opacitySlider && opacityVal) {
      const savedOpacity = localStorage.getItem("pandaOS_windowOpacity") || 0;
      opacitySlider.value = savedOpacity;
      opacityVal.textContent = savedOpacity + "%";
      document.querySelectorAll(".window").forEach((win) => {
        win.style.opacity = (100 - savedOpacity) / 100;
      });
      opacitySlider.addEventListener("input", (e) => {
        let val = parseInt(e.target.value, 10);
        opacityVal.textContent = val + "%";
        const alpha = (100 - val) / 100;
        document.querySelectorAll(".window").forEach((win) => {
          win.style.opacity = alpha;
        });
        localStorage.setItem("pandaOS_windowOpacity", val);
      });
    }

    const termFontSlider = document.getElementById("terminal-font-size");
    const termFontVal = document.getElementById("terminal-font-value");
    if (termFontSlider && termFontVal) {
      const savedFont = localStorage.getItem("pandaOS_terminalFont") || 14;
      termFontSlider.value = savedFont;
      termFontVal.textContent = savedFont + "px";
      const updateTerminalFont = () => {
        const terminalOutput = document.getElementById("terminal-output");
        const terminalInput = document.getElementById("terminal-input");
        if (terminalOutput) terminalOutput.style.fontSize = savedFont + "px";
        if (terminalInput) terminalInput.style.fontSize = savedFont + "px";
      };
      updateTerminalFont();
      termFontSlider.addEventListener("input", (e) => {
        let val = parseInt(e.target.value, 10);
        termFontVal.textContent = val + "px";
        localStorage.setItem("pandaOS_terminalFont", val);
        if (document.getElementById("terminal-output")) {
          document.getElementById("terminal-output").style.fontSize =
            val + "px";
          document.getElementById("terminal-input").style.fontSize = val + "px";
        }
      });
    }

    const dockAutohide = document.getElementById("dock-autohide");
    const dockStatus = document.getElementById("dock-autohide-status");
    const dock = document.getElementById("dock");
    const taskbar = document.getElementById("taskbar");
    let hideTimeout = null;
    if (dockAutohide && dockStatus && dock && taskbar) {
      const savedHide = localStorage.getItem("pandaOS_dockAutohide") === "true";
      dockAutohide.checked = savedHide;
      dockStatus.textContent = savedHide ? "Enabled" : "Disabled";
      const applyHide = (enable) => {
        if (enable) {
          const hideDock = () => {
            if (!taskbar.matches(":hover") && !dock.matches(":hover")) {
              dock.style.opacity = "0";
              dock.style.pointerEvents = "none";
            }
          };
          taskbar.addEventListener("mouseleave", () => {
            hideTimeout = setTimeout(hideDock, 2000);
          });
          taskbar.addEventListener("mouseenter", () => {
            if (hideTimeout) clearTimeout(hideTimeout);
            dock.style.opacity = "1";
            dock.style.pointerEvents = "auto";
          });
          dock.style.opacity = "1";
          dock.style.pointerEvents = "auto";
        } else {
          if (hideTimeout) clearTimeout(hideTimeout);
          dock.style.opacity = "1";
          dock.style.pointerEvents = "auto";
        }
      };
      applyHide(savedHide);
      dockAutohide.addEventListener("change", (e) => {
        const isEnabled = e.target.checked;
        dockStatus.textContent = isEnabled ? "Enabled" : "Disabled";
        localStorage.setItem("pandaOS_dockAutohide", isEnabled);
        applyHide(isEnabled);
      });
    }

    const tabs = document.querySelectorAll(".settings-tab");
    const panes = document.querySelectorAll(".settings-pane");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-tab");
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        panes.forEach((pane) => pane.classList.remove("active"));
        const activePane = document.getElementById(`tab-${target}`);
        if (activePane) activePane.classList.add("active");
      });
    });
  },
};
