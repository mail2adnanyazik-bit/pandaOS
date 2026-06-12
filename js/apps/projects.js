window.pandaOS = window.pandaOS || {};

window.pandaOS.projects = {
  title: "Projects",
  width: 550,
  height: 450,
  getContent: () => `
    <div style="display:flex; flex-direction:column; gap:16px; padding:8px; overflow-y:auto; height:100%;">
      <div style="border-left:3px solid #0AACFF; padding-left:12px;">
        <strong>pandaVim</strong> – Neovim config (TokyoNight theme, custom keymaps)<br>
        <a href="https://github.com/mail2adnanyazik-bit/pandaVim" target="_blank" style="color:#0AACFF;">github.com/mail2adnanyazik-bit/pandaVim</a>
      </div>
      <div style="border-left:3px solid #0AACFF; padding-left:12px;">
        <strong>filesort</strong> – Python CLI to sort files by extension/category<br>
        <a href="https://github.com/mail2adnanyazik-bit/filesort" target="_blank" style="color:#0AACFF;">github.com/mail2adnanyazik-bit/filesort</a>
      </div>
      <div style="border-left:3px solid #0AACFF; padding-left:12px;">
        <strong>NeoFolio</strong> – Neovim‑themed portfolio website<br>
        <a href="https://github.com/mail2adnanyazik-bit/NeoFolio" target="_blank" style="color:#0AACFF;">github.com/mail2adnanyazik-bit/NeoFolio</a>
      </div>
      <div style="border-left:3px solid #0AACFF; padding-left:12px;">
        <strong>pandaOS</strong> – This very WebOS! Tailored to me, built by me.<br>
        <a href="https://github.com/mail2adnanyazik-bit/pandaOS" target="_blank" style="color:#0AACFF;">github.com/mail2adnanyazik-bit/pandaOS</a>
      </div>
    </div>
  `,
  init: () => {},
};
