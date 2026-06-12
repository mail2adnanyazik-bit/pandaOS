(function () {
  window.pandaOS = window.pandaOS || {};

  window.pandaOS.generateID = function () {
    return "win-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6);
  };

  window.pandaOS.getNextZIndex = function () {
    const windows = Array.from(document.querySelectorAll(".window"));
    const maxZ = windows.reduce((max, win) => {
      const z = parseInt(win.style.zIndex, 10);
      return isNaN(z) ? max : Math.max(max, z);
    }, 100);
    return maxZ + 1;
  };

  window.pandaOS.focusWindow = function (windowEl) {
    if (!windowEl) return;
    const newZ = window.pandaOS.getNextZIndex();
    windowEl.style.zIndex = newZ;
  };

  window.pandaOS.centerWindow = function (windowEl, width, height) {
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    windowEl.style.left = Math.max(0, left) + "px";
    windowEl.style.top = Math.max(0, top) + "px";
  };

  window.pandaOS.debounce = function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  window.pandaOS.saveWindowPosition = function(appId, left, top, width, height) {
    const positions = JSON.parse(localStorage.getItem('pandaOS_windowPositions') || '{}')
    positions[appId] = { left, top, width, height }
    localStorage.setItem('pandaOS_windowPositions', JSON.stringify(positions))
  }

  window.pandaOS.loadWindowPosition = function(appId) {
    const positions = JSON.parse(localStorage.getItem('pandaOS_windowPositions') || '{}')
    return positions[appId] || null
  }
})();
