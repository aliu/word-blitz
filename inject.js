window.fetch = patch(window.fetch)

function patch (fn) {
  return async function (...args) {
    const result = await fn(...args);
    const cloned = result.clone()

    if (cloned.url.includes('api-prod-dot-lotum-wordblitz.appspot.com/game/list')) {
      const data = await cloned.json()
      const boards = [data.daily.board]

      for (const game of data.openGames) {
        boards.push(
          game.rounds[0].board,
          game.rounds[1].board,
          game.rounds[2].board
        )
      }
      window.dispatchEvent(new CustomEvent("onBoardData", { detail: boards }))
    }

    if (cloned.url.includes('api-prod-dot-lotum-wordblitz.appspot.com/game/create')) {
      const data = await cloned.json()

      window.dispatchEvent(new CustomEvent("onBoardData", {
        detail: [
          data.game.rounds[0].board,
          data.game.rounds[1].board,
          data.game.rounds[2].board
        ]
      }))
    }
    return result
  }
}
