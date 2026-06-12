// spotlight.js – app search (Ctrl+Space / Cmd+Space)

(function () {
  const searchOverlay = document.getElementById("search-overlay");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  const allApps = [
    { id: "terminal", name: "Terminal" },
    { id: "projects", name: "Projects" },
    { id: "profile", name: "Panda Profile" },
    { id: "sysmon", name: "PandaSys" },
    { id: "music", name: "Music Player" },
    { id: "calculator", name: "Calculator" },
    { id: "notes", name: "Notes" },
    { id: "about", name: "About" },
    { id: "settings", name: "Settings" },
  ];
  let currentSearchIndex = -1;

  function showSearch() {
    searchOverlay.classList.remove("hidden");
    searchInput.value = "";
    searchResults.innerHTML = "";
    currentSearchIndex = -1;
    searchInput.focus();
    filterApps("");
  }

  function hideSearch() {
    searchOverlay.classList.add("hidden");
  }

  function filterApps(query) {
    const lowerQuery = query.toLowerCase();
    const filtered = allApps.filter((app) =>
      app.name.toLowerCase().includes(lowerQuery),
    );
    searchResults.innerHTML = "";
    filtered.forEach((app, idx) => {
      const div = document.createElement("div");
      div.className = "search-result-item";
      div.textContent = app.name;
      div.dataset.id = app.id;
      div.dataset.index = idx;
      div.addEventListener("click", () => {
        if (window.pandaOS && window.pandaOS.openApp) {
          window.pandaOS.openApp(app.id);
        }
        hideSearch();
      });
      searchResults.appendChild(div);
    });
    if (filtered.length > 0) {
      currentSearchIndex = 0;
      const first = searchResults.querySelector(".search-result-item");
      if (first) first.classList.add("selected");
    } else {
      currentSearchIndex = -1;
    }
  }

  searchInput.addEventListener("input", (e) => {
    filterApps(e.target.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    const items = document.querySelectorAll(".search-result-item");
    if (items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (currentSearchIndex < items.length - 1) {
        items[currentSearchIndex].classList.remove("selected");
        currentSearchIndex++;
        items[currentSearchIndex].classList.add("selected");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (currentSearchIndex > 0) {
        items[currentSearchIndex].classList.remove("selected");
        currentSearchIndex--;
        items[currentSearchIndex].classList.add("selected");
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = document.querySelector(".search-result-item.selected");
      if (selected) {
        const appId = selected.dataset.id;
        if (window.pandaOS && window.pandaOS.openApp) {
          window.pandaOS.openApp(appId);
        }
        hideSearch();
      }
    }
  });

  window.addEventListener("keydown", (e) => {
    console.log("Key pressed:", e.key, "Ctrl:", e.ctrlKey, "Cmd:", e.metaKey);
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      console.log("Opening search");
      showSearch();
    }
    if (e.key === "Escape" && !searchOverlay.classList.contains("hidden")) {
      hideSearch();
    }
  });
})();
