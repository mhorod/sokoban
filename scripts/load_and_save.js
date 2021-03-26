// Saving and loading game state (from cookies)

// Set a cookie that expires in 10 years
function set_cookie(name, value) {
  Cookies.set(name, value, { sameSite: 'strict', expires: 10 * 365 })
  console.log(name, value)
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
  Cookies.remove("game-state")
}

function empty_game_state() {
  return {
    saved_games: [],
    user_levels: [],
    ranking: [],
  }
}

function save_game_state(game_state) {
  let cookie_value = JSON.stringify(game_state)
  set_cookie("game-state", cookie_value)
}

function load_game_state() {
  let cookie_value = Cookies.get("game-state")
  if (cookie_value != undefined) return JSON.parse(cookie_value)
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
