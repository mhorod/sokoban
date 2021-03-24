// Sokoban game made for Motorola Science Cup
//

function init()
{
  link_menu_buttons()
  check_cookies_accepted()
  hide_all_menus()
  open_main_menu()
}


// Saving/loading game state
function accept_cookies()
{
  Cookies.set("cookies-accepted", "true", {sameSite: 'strict', secure:true});
  check_cookies_accepted()
}

function check_cookies_accepted()
{
  console.log(Cookies.get("cookies-accepted"))
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
// ---------------------------------------- 



TILE_SIZE = 40
function px(n)
{
  return String(n) + "px";
}

function size_and_position_element(element, x, y)
{
  element.style.width = px(TILE_SIZE)
  element.style.height = px(TILE_SIZE)
  element.style.left = px(x * TILE_SIZE)
  element.style.top = px(y * TILE_SIZE) 
}

function empty_tile_at(x, y)
{
  let tile = document.createElement("div")
  tile.classList.add("tile")
  size_and_position_element(tile, x, y)
  tile.style.height = px(1.5 * TILE_SIZE)
  return tile
}

function new_box_at(x, y)
{
  let box = document.createElement("div")
  box.classList.add("box")
  size_and_position_element(box, x, y)
  return box
}

function new_player_at(x, y)
{
  let player = document.createElement("div")
  player.classList.add("player")
  size_and_position_element(player, x, y)
  return player
}


function draw_level(level)
{
  let element = document.createElement("div")
  if (level.width == 0 || level.height == 0) return element
  let tiles = new Array(level.width)
  element.style.width = px(level.width * TILE_SIZE)
  element.style.height = px(level.height * TILE_SIZE + TILE_SIZE / 2)

  for (let x = 0; x < level.width; x++)
  {
    tiles[x] = new Array(level.height)
    for (let y = 0; y < level.height; y++)
    {
      let tile = empty_tile_at(x, y)
      tile.classList.add("tile-floor")
      tiles[x][y] = tile
      element.appendChild(tile)
    }
  }

  for (let [x, y] of level.walls)     
  {
    tiles[x][y].remove()
  }

  for (let [x, y] of level.targets) 
  {
    tiles[x][y].classList.remove("tile-floor")
    tiles[x][y].classList.add("tile-target")
  }

  for (let [x, y] of level.boxes)
  {
    tiles[x][y].classList.add("has-box")
    let box = new_box_at(x, y)
    element.appendChild(box)
  }

  let player = new_player_at(level.player[0], level.player[1])
  element.appendChild(player) 
  return element
}

function add_difficulty_class(element, difficulty)
{
  if (difficulty == EASY) element.classList.add('easy')
  if (difficulty == MEDIUM) element.classList.add('medium')
  if (difficulty == HARD) element.classList.add('hard')
}


function link_difficulty_menu(levels_by_difficulty)
{
  let menu = document.getElementById("difficulty-menu")
  let easy = menu.querySelector("#easy-btn")
  let medium = menu.querySelector("#medium-btn")
  let hard = menu.querySelector("#hard-btn")

  easy.onclick = () => {play_at_level(levels_by_difficulty.easy.sample())}
  medium.onclick = () => {play_at_level(levels_by_difficulty.medium.sample())}
  hard.onclick = () => {play_at_level(levels_by_difficulty.hard.sample())}
}

function generate_all_levels_menu(game_state, default_levels)
{
  let menu = document.getElementById("all-levels-menu")
  let buttons = menu.getElementsByClassName("grid-buttons")[0]
  let preview = menu.querySelector(".level-preview-wrapper")
  for (let level_number = 1; level_number <= default_levels.length; level_number++)
  {
    let button = document.createElement("button")
    button.classList.add("btn")
    button.textContent = level_number
    let level = get_current_level_state(level_number - 1, game_state, default_levels)
    add_difficulty_class(button, level.difficulty)

    button.onmouseover = _ => {
      let p = draw_level(level)
      preview.style.display = "block"
      p.classList.add("level-preview")
      preview.innerHTML = ""
      preview.appendChild(p)
    }
    
    button.onmouseout = _ => {
      preview.style.display = "none"
    }

    button.onclick = () => {hide_all_levels_menu(); play_at_level(level)}
    buttons.appendChild(button)
  }
}

function generate_level_editor_menu(levels)
{
  let menu = document.getElementById("level-editor-menu")
  let buttons = menu.getElementsByClassName("grid-buttons")[0]
  let preview = menu.querySelector(".level-preview-wrapper")
  let level_number = 1;
  let add_new_level_button = menu.querySelector("#add-new-level")
  add_new_level_button.onclick = _ => {
    let level = create_new_level()
    levels.push(level)
    generate_level_editor_menu(levels)
  }

  for (let level of levels)
  {
    let button = document.createElement("button")
    button.classList.add("btn")
    button.textContent = level_number
    button.onmouseover = _ => {
      preview.style.display = "block"
      let p = draw_level(level)
      p.classList.add("level-preview")
      preview.innerHTML = ""
      preview.appendChild(p)
    }

    button.onmouseout = _ => {
      preview.style.display = "none"
    }

    button.onclick = _ => edit_level(level)
    level_number += 1
    buttons.appendChild(button)
  }
}

function get_current_level_state(level_index, game_state, default_levels)
{
  for (let level of game_state.saved_levels)
    if (level.index == level_index) 
      return level;
  return default_levels[level_index]
}


levels = load_levels_from_string(LEVELS)


levels_by_difficulty = {
  easy: levels.filter(e => e.difficulty == EASY),
  medium: levels.filter(e => e.difficulty == MEDIUM),
  hard: levels.filter(e => e.difficulty == HARD),
}

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}


function play_at_level(level)
{
  hide_all_menus()
  open_game()
  let level_display = draw_level(level)
  document.getElementById("game-wrapper").innerHTML = ""
  document.getElementById("game-wrapper").appendChild(level_display)
}

function create_new_level()
{
  let level = new Level();
  level.width = level.height = 10;
  return level
}

function edit_level(level)
{
  hide_all_menus()
  open_level_editor()
  let level_display = draw_level(level)
  document.getElementById("edited-level-wrapper").innerHTML = ""
  document.getElementById("edited-level-wrapper").appendChild(level_display)
}

game_state = load_game_state()
generate_all_levels_menu(game_state, levels)
generate_level_editor_menu(game_state.user_levels)
link_difficulty_menu(levels_by_difficulty)

init()


