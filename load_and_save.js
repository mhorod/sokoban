// Saving and loading game state (from cookies)

function accept_cookies()
{
  Cookies.set("cookies-accepted", "true", {sameSite: 'strict', secure:true});
  check_cookies_accepted()
}

function check_cookies_accepted()
{
  if (Cookies.get('cookies-accepted') != undefined)
    document.getElementById("cookies-popup").style.display = "none"
}

function reset_game_state()
{
  Cookies.remove("game-state")
} 

function empty_game_state()
{
  return {
    saved_games : [],
    user_levels : [],
    ranking : [],
  }
}

function save_game_state(game_state)
{
  let cookieValue = JSON.stringify(game_state)
  Cookies.set("game-state", cookieValue, {sameSite: 'strict', secure:true});
}

function load_game_state()
{
  let cookieValue = Cookies.get("game-state")
  if (cookieValue != undefined) return JSON.parse(cookieValue)
  return empty_game_state()
}

class SaveToCookie 
{
  constructor(game, game_state) { 
    this.game = game;
    this.game_state = game_state 
  }

  save_game(game)
  {
    let index = undefined
    for (let i = 0 ; i < game_state.saved_games.length; i++)
      if (game.name == this.game_state.saved_games[i].name)
        index = i

    if (index == undefined)
      this.game_state.saved_games.push(game)
    else
      this.game_state.saved_games[index] = game

    save_game_state(this.game_state)
  }
  
  save_level(level)
  {
    this.game.level = level;
    this.save_game(this.game)
  }
}

function get_current_level_state(level_index, game_state, original_levels)
{
  for (let level of game_state.saved_levels)
    if (level.index == level_index) 
      return level;
  return original_levels[level_index]
}

function split_levels_by_difficulty(levels)
{
  return {
    easy: levels.filter(e => e.difficulty == EASY),
    medium: levels.filter(e => e.difficulty == MEDIUM),
    hard: levels.filter(e => e.difficulty == HARD),
  }
}

function create_new_game(name, levels)
{
  let game = {
    name: name,
    level: levels[0],
    points: 0,
  } 
  return game
}
