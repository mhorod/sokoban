// Game state and manipulation of it

/**
 * Represents a complete game state used by game
 */
class GameState {
  constructor() {
    this.saved_games = []
    this.ranking = []
    this.user_levels = []
    this.paused_user_levels = []
    this.next_user_level_index = 0
  }
}
/**
 * Represents progress of passing all levels from Module 2
 */
class Game {
  /**
   * 
   * @param {string} name 
   * @param {Level} level 
   */
  constructor(name, level) {
    this.name = name
    this.level = level
    this.score = 0
  }
}
/** Creates independent clone of the game
 * 
 * @param {Game} game 
 */
function clone_game(game) {
  let obj = new Game(game.name, clone_level(game.level))
  obj.score = game.score
  return obj
}

class RankingEntry {
  /**
   * 
   * @param {string} name 
   * @param {number} score 
   */
  constructor(name, score) {
    this.name = name
    this.score = score
  }
}


/** 
 * Splits level by set difficulty.
 * If level's difficulty is undefined it's ignored
 * 
* @param {Level[]} levels Array of levels to split
* @return {LevelsByDiffcutly}
*/
function split_levels_by_difficulty(levels) {
  return {
    easy: levels.filter(e => e.difficulty == EASY),
    medium: levels.filter(e => e.difficulty == MEDIUM),
    hard: levels.filter(e => e.difficulty == HARD),
  }
}


/** Removes game from saved and inserts score into ranking
 * @param {Game} game
 * @param {GameState} game_state
 */
function move_game_to_ranking(game, game_state) {
  let ranking_entry = new RankingEntry(game.name, game.score)
  remove_saved_game(game, game_state)
  insert_into_ranking(ranking_entry, game_state.ranking)
}

/** Saves game into game_state
 * 
 * @param {Game} game 
 * @param {GameState} game_state 
 */
function save_game(game, game_state) {
  game = clone_game(game)

  let index = get_saved_game_index_by_name(game.name, game_state)
  if (index == undefined)
    game_state.saved_games.push(game)
  else
    game_state.saved_games[index] = game
}

/**
 * Removes given game from game state if present
 * @param {Game} game 
 * @param {GameState} game_state 
 */
function remove_saved_game(game, game_state) {
  game_index = get_saved_game_index_by_name(game.name, game_state)
  if (game_index != undefined)
    game_state.saved_games.splice(game_index, 1)
}

function get_saved_game_index_by_name(name, game_state) {
  for (let i = 0; i < game_state.saved_games.length; i++)
    if (name == game_state.saved_games[i].name)
      return i
}

/**
 * Inserts given entry into ranking
 * @param {RankingEntry} entry 
 * @param {RankingEntry[]} ranking 
 */
function insert_into_ranking(entry, ranking) {
  ranking.push(entry)
  ranking.sort((a, b) => a.score < b.score)
}

/**
 * Removes given entry from ranking
 * @param {RankingEntry} entry 
 * @param {RankingEntry[]} ranking 
 */
function remove_from_ranking(entry, ranking) {
  let index = ranking.indexOf(entry)
  ranking.splice(index, 1)
}


/** Saves level created by user and sets its paused state
 * 
 * @param {Level} level 
 * @param {GameState} game_state 
 */
function save_user_level(level, game_state) {
  if (level.index == undefined)
    save_new_user_level(level, game_state)
  else {
    for (let i = 0; i < game_state.user_levels.length; i++)
      if (game_state.user_levels[i].index == level.index)
        game_state.user_levels[i] = clone_level(level)
    save_paused_user_level(level, game_state)
  }
}

/** Saves paused level created by user
 * 
 * @param {Level} level 
 * @param {GameState} game_state 
 */
function save_paused_user_level(level, game_state) {
  level = clone_level(level)
  for (let i = 0; i < game_state.paused_user_levels.length; i++)
    if (game_state.paused_user_levels[i].index == level.index)
      game_state.paused_user_levels[i] = level
}

/** Creates new level in game_state 
 *  Sets provided level index  
 * 
 * @param {Level} level 
 * @param {GameState} game_state 
 */
function save_new_user_level(level, game_state) {
  level.index = game_state.next_user_level_index
  level = clone_level(level)
  game_state.next_user_level_index += 1
  game_state.user_levels.push(level)
  game_state.paused_user_levels.push(level)
}

/** Removes level from levels created by user
 * and from paused levels
 * 
 * @param {Level} level 
 * @param {GameState} game_state 
 */
function remove_user_level(level, game_state) {
  let index = undefined
  for (let i = 0; i < game_state.user_levels.length; i++)
    if (game_state.user_levels[i].index == level.index)
      index = i

  if (index != undefined)
    game_state.user_levels.splice(index, 1)

  remove_paused_user_level(level, game_state)
}

/** Removes level from paused levels created by user
 * 
 * @param {Level} level 
 * @param {GameState} game_state 
 */
function remove_paused_user_level(level, game_state) {
  let index = undefined
  for (let i = 0; i < game_state.paused_user_levels.length; i++)
    if (game_state.paused_user_levels[i].index == level.index)
      index = i

  if (index != undefined)
    game_state.paused_user_levels.splice(index, 1)
}

/** Returns user level by given index.
 *  Level is presented in the state it was saved in editor.
 *  IOW, as it was never played on
 * @param {number} index 
 * @param {GameState} game_state 
 */
function get_user_level_by_index(index, game_state) {
  for (let level of game_state.user_levels)
    if (level.index == index)
      return level
}

/** Returns user level by given name
 *  Level is presented in the state it was saved in editor,
 *  IOW, as it was never played on
 * @param {string} name 
 * @param {GameState} game_state 
 */
function get_user_level_by_name(name, game_state) {
  for (let level of game_state.user_levels)
    if (level.name == name)
      return level
}


class BasicGameSaver {
  constructor(game, game_state) {
    this.game = game;
    this.game_state = game_state
  }

  save_game(game) {
    save_game(game, this.game_state)
    save_game_state(this.game_state)
  }

  save_level(level) {
    this.game.level = level
    this.save_game(this.game)
  }

  finish_game(game) {
    move_game_to_ranking(game, this.game_state)
    save_game_state(this.game_state)
  }
}