// Saving and loading game state (from cookies)
// We opted for naive and inefficient saving for simplicty
// though interface flexibility allows to easily replace it

/**
 * Set's a cookie
 * 
 * @param {string} name Cookie name
 * @param {string} value Cookie value
 */
function set_cookie(name, value) {
  Cookies.set(name, value, { sameSite: 'strict', expires: 10 * 365 })
}

/**
 *  
 * @param {string} name Name of the cookie to get value of
 * @return {string|undefined}
 */
function get_cookie(name) {
  return Cookies.get(name)
}
/**
 * 
 * @param {string} name Name of the cookie to remove
 */
function remove_cookie(name) {
  Cookies.remove(name)
}

/**
 * Saves user acknowledgement of cookies
 */
function accept_cookies() {
  set_cookie("cookies-accepted", "true")
  check_cookies_accepted()
}
/**
 * Displays a message if cookies weren't acknowledged
 */
function check_cookies_accepted() {
  if (get_cookie("cookies-accepted") != undefined)
    document.getElementById("cookies-popup").style.display = "none"
}

/**
 * Removes all cookies related to game state
 */
function reset_game_state() {
  let game_state = load_game_state()
  for (let game of game_state.saved_games)
    remove_cookie(`saved-game: ${game.name}`)

  for (let user_level of game_state.user_levels)
    remove_cookie(`user-level: ${user_level.name}`)

  for (let user_level_game of game_state.user_level_games)
    remove_cookie(`user-level-game: ${user_level_game.name}`)
  remove_cookie('game-state')
}

/**
 * Saves serialized game state elements in cookies
 */
class SaveToCookie {
  save_game_state(game_state, serialized) {
    this.clear_unused_cookies(game_state)
    let cookie_name = `game-state`
    set_cookie(cookie_name, serialized)
  }

  save_game(name, serialized) {
    let cookie_name = `saved-game: ${name}`
    set_cookie(cookie_name, serialized)
  }

  save_user_level(name, serialized) {
    let cookie_name = `user-level: ${name}`
    set_cookie(cookie_name, serialized)
  }

  save_paused_user_level(name, serialized) {
    let cookie_name = `paused-user-level: ${name}`
    set_cookie(cookie_name, serialized)
  }

  clear_unused_cookies(new_game_state) {
    let deserializer = new BasicDeserializer()
    let loader = new LoadFromCookie()
    let serialized = loader.load_game_state()

    if (serialized == undefined) return
    let current_game_state = deserializer.deserialize_game_state(serialized)

    for (let name of current_game_state.saved_games)
      if (new_game_state.saved_games.every(g => g.name != name)) {
        remove_cookie(`saved-game: ${name}`)
      }

    for (let name of current_game_state.user_levels)
      if (new_game_state.user_levels.every(l => l.name != name)) {
        remove_cookie(`user-level: ${name}`)
      }

    for (let name of current_game_state.paused_user_levels)
      if (new_game_state.paused_user_levels.every(l => l.name != name)) {
        remove_cookie(`paused-user-level: ${name}`)
      }

  }
}

/**
 * Loads serialized game state elements from cookies
 */
class LoadFromCookie {
  load_game_state() {
    let cookie_name = `game-state`
    return get_cookie(cookie_name)
  }

  load_game(name) {
    let cookie_name = `saved-game: ${name}`
    return get_cookie(cookie_name)
  }

  load_user_level(name) {
    let cookie_name = `user-level: ${name}`
    return get_cookie(cookie_name)
  }

  load_paused_user_level(name) {
    let cookie_name = `paused-user-level: ${name}`
    return get_cookie(cookie_name)
  }
}

class BasicSerializer {
  serialize_game_state(game_state) {
    let game_state_to_save = new GameState()
    game_state_to_save.ranking = game_state.ranking
    game_state_to_save.next_user_level_index = game_state.next_user_level_index

    // Single cookie has a size limit, so every game and level are stored separately
    game_state_to_save.saved_games = Array.from(game_state.saved_games, e => e.name)
    game_state_to_save.user_levels = Array.from(game_state.user_levels, e => e.name)
    game_state_to_save.paused_user_levels = Array.from(game_state.paused_user_levels, e => e.name)
    return JSON.stringify(game_state_to_save)
  }

  serialize_game(game) {
    return JSON.stringify(game)
  }
  serialize_level(level) {
    return JSON.stringify(level)
  }
}

class BasicDeserializer {
  deserialize_game_state(serialized) {
    return JSON.parse(serialized)
  }

  deserialize_game(serialized) {
    return JSON.parse(serialized)
  }
  deserialize_level(serialized) {
    return JSON.parse(serialized)
  }
}


/** Saves game state using provided serializer and saver
 * 
 * @param {GameState} game_state 
 * @param {Serializer} serializer 
 * @param {Saver} saver 
 */
function save_game_state(
  game_state,
  serializer = new BasicSerializer(),
  saver = new SaveToCookie()) {

  saver.save_game_state(game_state, serializer.serialize_game_state(game_state))
  for (let game of game_state.saved_games)
    saver.save_game(game.name, serializer.serialize_game(game))

  for (let level of game_state.user_levels)
    saver.save_user_level(level.name, serializer.serialize_level(level))

  for (let level of game_state.paused_user_levels)
    saver.save_paused_user_level(level.name, serializer.serialize_level(level))

}
/** Loads game state using provided deserializer and loader
 * 
 * @param {Deserializer} deserializer 
 * @param {Loader} loader 
 */
function load_game_state(
  deserializer = new BasicDeserializer(),
  loader = new LoadFromCookie()) {

  let game_state = new GameState()
  let loaded_state = loader.load_game_state()
  if (loaded_state != undefined) {
    let state = deserializer.deserialize_game_state(loaded_state)
    game_state.ranking = state.ranking
    game_state.next_user_level_index = state.next_user_level_index

    for (let name of state.saved_games)
      game_state.saved_games.push(deserializer.deserialize_game(loader.load_game(name)))

    for (let name of state.user_levels)
      game_state.user_levels.push(deserializer.deserialize_level(loader.load_user_level(name)))

    for (let name of state.paused_user_levels)
      game_state.paused_user_levels.push(deserializer.deserialize_level(loader.load_paused_user_level(name)))
  }

  return game_state
}