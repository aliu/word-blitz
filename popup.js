const button = document.getElementById('start')
const slider = document.getElementById('speed')

button.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { message: 'start' })
  })
})

slider.addEventListener('input', (e) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      message: 'speed',
      speed: 100 - e.srcElement.value
    })
  })
})
