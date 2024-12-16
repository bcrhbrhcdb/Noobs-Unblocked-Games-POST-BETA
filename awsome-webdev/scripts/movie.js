function Launchmovies(){
    const win = window.open()
    const iframe = document.createElement('iframe')
    iframe.src = 'https://flix.cbass92.org'
    iframe.setAttribute('style', 'position: absolute; width: 100vw; height: 100vh; top: 0px; left: 0px; border: none;')
    win.document.body.appendChild(iframe)
    const cred = document.createElement('div')
    cred.setAttribute('style', 'position: absolute; width: 30vw; height: 30vh; background-color: rgb(244, 204, 67); left:35vw; border-radius: 10px;')
    cred.setAttribute('id', 'cred')
    cred.innerHTML = '<h1 style="margin: 10px;">Credit (not made by us!)</h1><br><p style="margin: 10px;">Hosted by <a href="https://github.com/sebastian-92">Cbass92</a></p><p style="margin: 10px;">Forked from <a href="https://github.com/Shivam171/tvflix">Tvflix</a></p><br><div style="margin: 10px; color: white; background-color: rgb(23, 107, 170); border-radius: 10px; padding: 10px; width: fitcontent; text-align: center; margin-bottom:20px;"  onclick="document.getElementById(\'cred\').style.display = \'none\'">Close</div>'
    win.document.body.appendChild(cred)
}