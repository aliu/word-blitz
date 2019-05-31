const boards = new Map()
let running = false

window.addEventListener('onBoardData', (data) => {
  for (const board of data.detail) {
    boards.set(board.letters, board.words)
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'start') start()
})

async function start () {
  const game = document.getElementsByClassName('core-letter-grid')[0]
  if (running || game === undefined) return

  running = true

  const tiles = [...document.getElementsByClassName('letter-brick')]
  const data = getTileData(tiles)

  const letters = data.letters.join('')
  const words = boards.get(letters)

  const paths = solve(letters, words)

  for (const path of paths) {
    game.dispatchEvent(new MouseEvent('mousedown', data.positions[path[0]]))
    for (const idx of path) {
      await sleep(50)
      game.dispatchEvent(new MouseEvent('mousemove', data.positions[idx]))
    }
    game.dispatchEvent(new MouseEvent('mouseup', data.positions[path[path.length - 1]]))
  }

  running = false
}

function getTileData (tiles) {
  const data = {
    letters: [],
    points: [],
    positions:[]
  }

  for (const tile of tiles) {
    data.letters.push(tile.getElementsByClassName('letter')[0].innerText)
    data.points.push(tile.getElementsByClassName('points')[0].innerText)

    const rect = tile.getBoundingClientRect()
    data.positions.push({
      clientX: (rect.left + rect.right) / 2,
      clientY: (rect.top + rect.bottom) / 2
    })
  }

  return data
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/*
 * Temporary workaround until
 * https://bugs.chromium.org/p/chromium/issues/detail?id=487422
 * is implemented in Chrome
 */
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', chrome.extension.getURL('inject.js'))
document.body.appendChild(script)
