const neighbors = [
  new Set([1, 4, 5]),
  new Set([0, 2, 4, 5, 6]),
  new Set([1, 3, 5, 6, 7]),
  new Set([2, 6, 7]),
  new Set([0, 1, 5, 8, 9]),
  new Set([0, 1, 2, 4, 6, 8, 9, 10]),
  new Set([1, 2, 3, 5, 7, 9, 10, 11]),
  new Set([2, 3, 6, 10, 11]),
  new Set([4, 5, 9, 12, 13]),
  new Set([4, 5, 6, 8, 10, 12, 13, 14]),
  new Set([5, 6, 7, 9, 11, 13, 14, 15]),
  new Set([6, 7, 10, 14, 15]),
  new Set([8, 9, 13]),
  new Set([8, 9, 10, 12, 14]),
  new Set([9, 10, 11, 13, 15]),
  new Set([10, 11, 14]),
  // root node
  new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
]

function solve (letters, words) {
  return words
    .map(word => findPath(letters, word))
    .filter(path => path.length)
}

function findPath (letters, word) {
  const path = []

  function dfs (node, seen) {
    if (path.length === word.length) return true

    for (const nei of neighbors[node]) { 
      if (letters[nei] === word[path.length] && !seen.has(nei)) {
        path.push(nei)
        seen.add(nei)
        if (dfs(nei, seen)) return true
        path.pop()
        seen.delete(nei)
      }
    }
    return false
  }

  // start search from root node
  dfs(16, new Set())
  return path
}
