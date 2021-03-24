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
    user_levels : [],
    saved_levels : [],
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
  constructor(game_state) { this.game_state = game_state }
  save(level)
  {
    for (let i =0 ; i < game_state.saved_levels.length; i++)
      if (level.index == this.game_state.saved_levels[i].index)
      {
        this.game_state.saved_levels.splice(i, 1)
      }
    this.game_state.saved_levels.push(level)
    save_game_state(this.game_state)
  }
}

// Dummy saver - used in module 1 (random level by difficulty)
// where saving is disabled
class DontSave { save(){} }
