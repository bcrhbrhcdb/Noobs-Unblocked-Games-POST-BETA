function aboutblank(event){
    const a = event.target
    const url = a.textContent
    const win = open()
    const frame = document.createElement('iframe')
    frame.src = url
    frame.setAttribute('style', 'position: absolute; width: 100vw; height: 100vh; border: none; left: 0px; top: 0px;')
    win.document.body.appendChild(frame)
}
function aboutblank2(url){
    const win = open()
    const frame = document.createElement('iframe')
    frame.src = url
    frame.setAttribute('style', 'position: absolute; width: 100vw; height: 100vh; border: none; left: 0px; top: 0px;')
    win.document.body.appendChild(frame)
}