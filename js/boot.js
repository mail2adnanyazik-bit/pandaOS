(function() {
  // If already logged in, skip boot and show desktop directly
  if (localStorage.getItem('pandaOS_loggedIn') === 'true') {
    const overlay = document.getElementById('boot-overlay')
    if (overlay) overlay.style.display = 'none'
    if (window.pandaOS && window.pandaOS.initDesktop) window.pandaOS.initDesktop()
    return
  }

  const overlay = document.getElementById('boot-overlay')
  const bootMessagesDiv = document.getElementById('boot-messages')
  const bootProgress = document.getElementById('boot-progress')
  const loginArea = document.getElementById('login-area')
  const usernameInput = document.getElementById('login-username')
  const passwordInput = document.getElementById('login-password')
  const loginError = document.getElementById('login-error')
  const loginBtn = document.getElementById('login-btn')

  const bootSteps = [
    "Loading kernel modules ...",
    "Starting system services ...",
    "Mounting filesystems ...",
    "Initializing network interfaces ...",
    "Starting desktop manager ...",
    "Loading user environment ..."
  ]

  let step = 0

  function addBootMessage(msg) {
    const line = document.createElement('div')
    line.textContent = `[${(step+1).toString().padStart(2,'0')}] ${msg}`
    bootMessagesDiv.appendChild(line)
    bootMessagesDiv.scrollTop = bootMessagesDiv.scrollHeight
  }

  function updateProgress(value) {
    bootProgress.style.width = value + '%'
  }

  function nextBootStep() {
    if (step < bootSteps.length) {
      addBootMessage(bootSteps[step])
      updateProgress(((step + 1) / bootSteps.length) * 100)
      step++
      setTimeout(nextBootStep, 300)
    } else {
      addBootMessage('Boot complete. Ready for login.')
      updateProgress(100)
      setTimeout(() => {
        bootMessagesDiv.style.display = 'none'
        bootProgress.style.display = 'none'
        loginArea.style.display = 'block'
      }, 800)
    }
  }

  nextBootStep()

  function attemptLogin() {
    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()
    if (username === 'panda' && password === 'UseNvim') {
      localStorage.setItem('pandaOS_loggedIn', 'true')
      overlay.style.display = 'none'
      if (window.pandaOS && window.pandaOS.initDesktop) window.pandaOS.initDesktop()
    } else {
      loginError.textContent = 'Invalid credentials. Try login: panda / password: UseNvim'
      passwordInput.value = ''
    }
  }

  loginBtn.addEventListener('click', attemptLogin)
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') attemptLogin()
  })
})()
