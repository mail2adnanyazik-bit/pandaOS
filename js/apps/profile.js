window.pandaOS = window.pandaOS || {};

window.pandaOS.profile = {
  title: "Panda Profile",
  width: 550, // increased from 450
  height: 520, // increased from 420
  getContent: () => `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 24px;">
      <img src="https://static.vecteezy.com/system/resources/previews/006/936/459/non_2x/cute-panda-with-coffee-cartoon-illustration-vector.jpg" style="width: 140px; height: 140px; border-radius: 50%; border: 3px solid #0AACFF;">
      <h3 style="margin:0; color:#0AACFF; font-size: 1.8rem;">Adnan Yazik</h3>
      <p style="margin:0; color:#6A8A9A; font-size: 1.1rem;">aka "Panda" · 14 · Berlin</p>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
        <span style="background:#0A2A44; padding: 6px 14px; border-radius: 20px; font-size: 1rem;">🐼 Coding</span>
        <span style="background:#0A2A44; padding: 6px 14px; border-radius: 20px; font-size: 1rem;">🏸 Badminton</span>
        <span style="background:#0A2A44; padding: 6px 14px; border-radius: 20px; font-size: 1rem;">📚 Reading</span>
      </div>
      <div style="width:100%; border-top:1px solid #0A4A7A; margin: 8px 0;"></div>
      <div style="width:100%; font-size: 1rem;">
        <div style="margin-bottom: 12px;"><strong>GitHub:</strong> <a href="https://github.com/mail2adnanyazik-bit" target="_blank" style="color:#0AACFF;">@mail2adnanyazik-bit</a></div>
        <div style="margin-bottom: 12px;"><strong>Email:</strong> adnuspam@gmail.com</div>
        <div style="margin-bottom: 12px;"><strong>Discord:</strong> rogue_master12</div>
      </div>
      <div style="font-size:0.9rem; color:#4A6A8A;">pandaOS v1.0</div>
    </div>
  `,
  init: () => {},
};
