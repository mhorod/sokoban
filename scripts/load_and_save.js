// Saving and loading game state (from cookies)
// We opted for naive and inefficient saving for simplicty
// though interface flexibility makes replacing it trivial

// Set a cookie that expires in 10 years - 'permanent' storage
function set_cookie(name, value) {
  Cookies.set(name, value, { sameSite: 'strict', expires: 10 * 365 })
}

function get_cookie(name) {
  return Cookies.get(name)
}
function remove_cookie(name) {
  Cookies.remove(name)
}

function accept_cookies() {
  set_cookie("cookies-accepted", "true")
  check_cookies_accepted()
}

function check_cookies_accepted() {
  if (Cookies.get('cookies-accepted') != undefined)
    document.getElementById("cookies-popup").style.display = "none"
}

function reset_game_state() {
  let game_state = load_game_state()
  for (let game of game_state.saved_games)
    remove_game_cookie(game)

  for (let user_level of game_state.user_levels)
    remove_cookie(`user-level: ${user_level.name}`)

  for (let saved_user_level of game_state.saved_user_levels)
    remove_cookie(`saved-user-level: ${saved_user_level.name}`)
  remove_cookie('game-state')
}

function remove_game_cookie(game) {
  remove_cookie(`saved-game: ${game.name}`)
}

function empty_game_state() {
  return {
    saved_games: [],
    user_levels: [],
    saved_user_levels: [],
    ranking: [],
  }
}

function save_game_state(game_state) {
  // Single cookie has a size limit, so every game and level are stored separately
  let game_state_to_save = empty_game_state()
  game_state_to_save.ranking = game_state.ranking
  game_state_to_save.saved_games = Array.from(game_state.saved_games, e => e.name)
  game_state_to_save.user_levels = Array.from(game_state.user_levels, e => e.name)
  game_state_to_save.saved_user_levels = Array.from(game_state.saved_user_levels, e => e.name)

  let cookie_value = JSON.stringify(game_state_to_save)
  set_cookie("game-state", cookie_value)

  for (let saved_game of game_state.saved_games)
    set_cookie(`saved-game: ${saved_game.name}`, JSON.stringify(saved_game))

  for (let user_level of game_state.user_levels)
    set_cookie(`user-level: ${user_level.name}`, JSON.stringify(user_level))

  for (let saved_user_level of game_state.saved_user_levels)
    set_cookie(`saved-user-level: ${saved_user_level.name}`, JSON.stringify(saved_user_level))
}

function load_game_state() {
  let game_state = empty_game_state()
  let cookie_value = Cookies.get("game-state")
  if (cookie_value != undefined) {
    let state = JSON.parse(cookie_value)
    game_state.ranking = state.ranking
    for (let saved_game_name of state.saved_games)
      game_state.saved_games.push(JSON.parse(get_cookie(`saved-game: ${saved_game_name}`)))

    for (let user_level_name of state.user_levels)
      game_state.user_levels.push(JSON.parse(get_cookie(`user-level: ${user_level_name}`)))

    for (let saved_user_level of state.saved_user_levels)
      game_state.saved_user_levels.push(JSON.parse(get_cookie(`user-level: ${saved_user_level.name}`)))

    return game_state
  }
  else
    return empty_game_state()
}

class SaveToCookie {
  constructor(game, game_state) {
    this.game = game;
    this.game_state = game_state
  }

  save_game(game) {
    let index = undefined
    for (let i = 0; i < game_state.saved_games.length; i++)
      if (game.name == this.game_state.saved_games[i].name)
        index = i

    if (index == undefined)
      this.game_state.saved_games.push(game)
    else
      this.game_state.saved_games[index] = game

    save_game_state(this.game_state)
  }

  save_level(level) {
    this.game.level = level;
    this.save_game(this.game)
  }

  finish_game(game) {
    move_game_to_ranking(game)
  }
}

function get_current_level_state(level_index, game_state, original_levels) {
  for (let level of game_state.saved_levels)
    if (level.index == level_index)
      return level;
  return original_levels[level_index]
}

function split_levels_by_difficulty(levels) {
  return {
    easy: levels.filter(e => e.difficulty == EASY),
    medium: levels.filter(e => e.difficulty == MEDIUM),
    hard: levels.filter(e => e.difficulty == HARD),
  }
}

function create_new_game(name, levels) {
  let game = {
    name: name,
    level: clone_level(levels[0]),
    score: 0,
  }
  return game
}

// Removes game from saved and inserts score into ranking
function move_game_to_ranking(game, game_state) {
  let ranking_entry = {
    name: game.name,
    score: game.score,
  }
  remove_saved_game(game, game_state)
  insert_into_ranking(ranking_entry, game_state)
}

function remove_saved_game(game, game_state) {
  game_index = game_state.saved_games.indexOf(game)
  game_state.saved_games.splice(game_index, 1)
  remove_game_cookie(game)
}

function insert_into_ranking(entry, game_state) {
  game_state.ranking.push(entry)
  game_state.ranking.sort((a, b) => a.score < b.score)
}

function remove_ranking_entry(entry, ranking) {
  let index = undefined
  for (let i = 0; i < ranking.length; i++)
    if (ranking[i].name == entry.name)
      index = i
  ranking.splice(index, 1)
}