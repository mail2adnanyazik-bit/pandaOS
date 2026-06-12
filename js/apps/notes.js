window.pandaOS = window.pandaOS || {};

function renderMarkdown(md) {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^###### (.*$)/gm, "<h6>$1</h6>")
    .replace(/^##### (.*$)/gm, "<h5>$1</h5>")
    .replace(/^#### (.*$)/gm, "<h4>$1</h4>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/==(.*?)==/g, "<mark>$1</mark>")
    .replace(/~~(.*?)~~/g, "<del>$1</del>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/^\* (.*$)/gm, "<li>$1</li>")
    .replace(
      /```(\w*)\n([\s\S]*?)```/gm,
      '<pre><code class="language-$1">$2</code></pre>',
    );

  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");
  html = html.replace(/<\/ul>\n<ul>/g, "");
  html = html.replace(/\n\n/g, "<br><br>");
  return html;
}

window.pandaOS.notes = {
  title: "Notes (Markdown)",
  width: 850,
  height: 550,
  getContent: () => `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div style="display: flex; flex: 1; gap: 8px; padding: 8px;">
        <textarea id="notes-textarea" style="flex:1; background:#010C17; color:#CBE0F0; border:1px solid #0A4A7A; padding:8px; font-family:monospace; resize:none; outline:none;"></textarea>
        <div id="notes-preview" class="markdown-body" style="flex:1; background:#010C17; border:1px solid #0A4A7A; padding:8px; overflow-y:auto;"></div>
      </div>
      <div style="display: flex; gap: 12px; padding: 8px; border-top: 1px solid #0A4A7A;">
        <button id="notes-save" class="notes-btn">Save</button>
        <button id="notes-load" class="notes-btn">Load</button>
        <button id="notes-clear" class="notes-btn">Clear</button>
      </div>
    </div>
  `,
  init: function () {
    const checkExist = setInterval(() => {
      const textarea = document.getElementById("notes-textarea");
      if (textarea) {
        clearInterval(checkExist);
        this.attachEvents();
        textarea.focus();
      }
    }, 100);
  },
  attachEvents: function () {
    const textarea = document.getElementById("notes-textarea");
    const preview = document.getElementById("notes-preview");
    const saveBtn = document.getElementById("notes-save");
    const loadBtn = document.getElementById("notes-load");
    const clearBtn = document.getElementById("notes-clear");

    function updatePreview() {
      preview.innerHTML = renderMarkdown(textarea.value);
    }

    textarea.addEventListener("input", updatePreview);

    saveBtn.addEventListener("click", () => {
      localStorage.setItem("pandaOS_notes", textarea.value);
    });

    loadBtn.addEventListener("click", () => {
      const saved = localStorage.getItem("pandaOS_notes");
      if (saved) {
        textarea.value = saved;
        updatePreview();
      }
    });

    clearBtn.addEventListener("click", () => {
      textarea.value = "";
      updatePreview();
      localStorage.removeItem("pandaOS_notes");
    });

    const saved = localStorage.getItem("pandaOS_notes");
    if (saved) {
      textarea.value = saved;
      updatePreview();
    }
  },
};
