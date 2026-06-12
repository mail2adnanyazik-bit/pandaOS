(function () {
  let dragTarget = null
  let dragStartX = 0, dragStartY = 0
  let initialLeft = 0, initialTop = 0

  function onMouseDown(e) {
    const titleBar = e.target.closest(".window-titlebar")
    if (!titleBar) return

    const windowEl = titleBar.closest(".window")
    if (!windowEl) return

    e.preventDefault()

    dragTarget = windowEl

    const left = parseInt(windowEl.style.left, 10)
    const top = parseInt(windowEl.style.top, 10)
    initialLeft = isNaN(left) ? 0 : left
    initialTop = isNaN(top) ? 0 : top

    dragStartX = e.clientX
    dragStartY = e.clientY

    const allWindows = Array.from(document.querySelectorAll(".window"))
    const maxZ = Math.max(
      ...allWindows.map((w) => parseInt(w.style.zIndex, 10) || 100),
      100
    )
    windowEl.style.zIndex = maxZ + 1

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  function onMouseMove(e) {
    if (!dragTarget) return

    const dx = e.clientX - dragStartX
    const dy = e.clientY - dragStartY

    let newLeft = initialLeft + dx
    let newTop = initialTop + dy

    const maxX = window.innerWidth - dragTarget.offsetWidth
    const maxY = window.innerHeight - dragTarget.offsetHeight
    newLeft = Math.min(Math.max(newLeft, 0), maxX)
    newTop = Math.min(Math.max(newTop, 0), maxY)

    dragTarget.style.left = newLeft + "px"
    dragTarget.style.top = newTop + "px"
  }

  function onMouseUp() {
    if (dragTarget) {
      const appId = dragTarget.getAttribute('data-app-id')
      if (appId && window.pandaOS.saveWindowPosition) {
        const left = parseInt(dragTarget.style.left, 10)
        const top = parseInt(dragTarget.style.top, 10)
        const width = dragTarget.offsetWidth
        const height = dragTarget.offsetHeight
        window.pandaOS.saveWindowPosition(appId, left, top, width, height)
      }
    }
    dragTarget = null
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onMouseUp)
  }

  document.addEventListener("mousedown", onMouseDown)
})()
