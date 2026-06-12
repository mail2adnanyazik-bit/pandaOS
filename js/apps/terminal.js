window.pandaOS = window.pandaOS || {};

window.pandaOS.terminal = {
  title: "Terminal",
  width: 600,
  height: 350,
  getContent: () => `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div id="terminal-output" style="background:#000; color:#0f0; padding:8px; font-family:monospace; flex:1; overflow-y:auto;">Welcome to pandaOS Terminal<br/>> Type "help" for commands<br/></div>
      <input type="text" id="terminal-input" style="width:100%; background:#111; color:#0f0; border:none; padding:4px; font-family:monospace;" placeholder="> " autofocus>
    </div>
  `,
  init: function () {
    const checkExist = setInterval(() => {
      const inputField = document.getElementById("terminal-input");
      if (inputField) {
        clearInterval(checkExist);
        this.attachEvents();
      }
    }, 100);
  },
  attachEvents: function () {
    const inputField = document.getElementById("terminal-input");
    const outputDiv = document.getElementById("terminal-output");
    if (!inputField || !outputDiv) return;

    function addOutput(text) {
      outputDiv.innerHTML += `<div>> ${text}</div>`;
      outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const cmd = inputField.value.trim();
        if (cmd === "") return;
        addOutput(`$ ${cmd}`);
        if (cmd === "help") {
          addOutput(
            "Commands: help, clear, date, projects, profile, music, calculator, notes, settings",
          );
        } else if (cmd === "clear") {
          outputDiv.innerHTML = "";
        } else if (cmd === "date") {
          addOutput(new Date().toString());
        } else if (cmd === "projects") {
          window.pandaOS.openApp("projects");
        } else if (cmd === "profile") {
          window.pandaOS.openApp("profile");
        } else if (cmd === "music") {
          window.pandaOS.openApp("music");
        } else if (cmd === "calculator") {
          window.pandaOS.openApp("calculator");
        } else if (cmd === "notes") {
          window.pandaOS.openApp("notes");
        } else if (cmd === "settings") {
          window.pandaOS.openApp("settings");
        } else {
          addOutput(`Command not found: ${cmd}`);
        }
        inputField.value = "";
      }
    });
  },
};
