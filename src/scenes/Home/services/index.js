/**
 * to find the next field's index, if all fields have been selected, than return -1
 * @param {array} games 
 * @returns {number}
 */
export function getNextBetFieldIndex(games) {
  const leftGames = games.filter(game => game.player === '');
  if(!leftGames) {
    return -1;
  }

  const id = leftGames.map(game => game.id).sort()[0];
  return games.findIndex(game => game.id ===id);
}


const PUNCHES = ['scissor', 'stone', 'paper'];
export function getRandomPunch() {
  return PUNCHES[Math.floor(Math.random() * PUNCHES.length)];
}
