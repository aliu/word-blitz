const boards = new Map()
let running = false
let delay = 50

window.addEventListener('onBoardData', (data) => {
  for (const board of data.detail) {
    boards.set(board.letters, board.words)
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'start') start()
  if (request.message === 'speed') delay = request.speed
})

async function start () {
  const game = document.getElementsByClassName('core-letter-grid')[0]
  if (running || game === undefined) return

  running = true

  const tiles = [...document.getElementsByClassName('letter-brick')]
  const { letters, points } = getTileData(tiles)
  const words = boards.get(letters.join(''))
  const paths = solve(letters, words)

  for (const path of paths) {
    game.dispatchEvent(new MouseEvent('mousedown', getPosition(tiles[path[0]])))
    for (const idx of path) {
      await sleep(delay)
      game.dispatchEvent(new MouseEvent('mousemove', getPosition(tiles[idx])))
    }
    game.dispatchEvent(new MouseEvent('mouseup', getPosition(tiles[path[path.length - 1]])))
  }

  running = false
}

function getTileData (tiles) {
  const data = {
    letters: [],
    points: []
  }

  for (const tile of tiles) {
    data.letters.push(tile.getElementsByClassName('letter')[0].innerText)
    data.points.push(tile.getElementsByClassName('points')[0].innerText)
  }

  return data
}

function getPosition (tile) {
  const rect = tile.getBoundingClientRect()
  return {
    clientX: (rect.left + rect.right) / 2,
    clientY: (rect.top + rect.bottom) / 2
  }
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
