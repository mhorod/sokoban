// Module 2 menu 
//  - selection or creation of new game
//  - game is automatically saved
//  - ranking of completed games

ALL_LEVELS_MAIN_MENU = 'all-levels-main-menu'
CONTINUE_GAME_MENU = 'continue-game-menu'
NEW_GAME_MENU = 'new-game-menu'

function create_game_button(game_name) {
  let button = document.createElement("button")
  button.classList.add("btn")
  button.textContent = game_name
  return button
}

function generate_all_levels_menu(game_state, levels, play_game) {
  let menu = document.getElementById("all-levels-menu")

  let back_button = menu.querySelector(".back-btn")
  back_button.onclick = back_to_main_menu

  let continue_button = menu.querySelector("#continue-btn")
  let new_game_button = menu.querySelector("#new-game-btn")
  let ranking_button = menu.querySelector("#ranking-btn")

  // Hide continue button if there is no game to continue
  if (game_state.saved_games.length == 0)
    continue_button.classList.remove("shown")
  else
    continue_button.classList.add("shown")

  ranking_button.onclick = _ => show_ranking(game_state.ranking)
  continue_button.onclick = _ =>
    open_continue_game_menu(game_state, levels, play_game)
  new_game_button.onclick = _ => open_new_game_menu(game_state, levels)
}

function close_all_levels_menus() {
  close_menu(ALL_LEVELS_MAIN_MENU)
  close_menu(CONTINUE_GAME_MENU)
  close_menu(NEW_GAME_MENU)
}

function open_all_levels_main_menu() {
  close_all_levels_menus()
  open_menu(ALL_LEVELS_MAIN_MENU)
}

function show_level_preview(wrapper, level_display) {
  let preview = document.createElement("div")
  wrapper.innerHTML = ""
  preview.classList.add("level-preview")
  preview.appendChild(level_display)
  wrapper.appendChild(preview)
  wrapper.classList.add("shown")

  // Resize preview to fit the display
  let rect = level_display.getBoundingClientRect()
  preview.style.width = px(rect.width)
  preview.style.height = px(rect.height)
}

function hide_level_preview(wrapper) {
  wrapper.classList.remove("shown")
}

function open_continue_game_menu(game_state, levels, play_game) {
  close_all_levels_menus()
  open_menu(CONTINUE_GAME_MENU)
  let menu = document.getElementById(CONTINUE_GAME_MENU)

  let back_button = menu.querySelector(".back-btn")
  back_button.onclick = open_all_levels_main_menu

  let preview_wrapper = menu.querySelector(".level-preview-wrapper")
  preview_wrapper.innerHTML = ""

  let buttons = menu.querySelector(".menu-buttons")
  buttons.innerHTML = ""
  for (let game of game_state.saved_games) {
    let button = create_game_button(game.name)

    button.onmouseover = _ =>
      show_level_preview(preview_wrapper, draw_level(game.level).element)

    button.onmouseout = _ => hide_level_preview(preview_wrapper)

    button.onclick = _ => {
      play_game(game, game_state, levels)
    }
    buttons.appendChild(button)

  }
}

function is_name_free(name, game_state) {
  let unavailable = game_state.saved_games.some(game => game.name == name) ||
    game_state.ranking.some(entry => entry.name == name)

  return !unavailable
}

function open_new_game_menu(game_state, levels) {
  close_all_levels_menus()
  open_menu(NEW_GAME_MENU)
  let menu = document.getElementById(NEW_GAME_MENU)

  let back_button = menu.querySelector(".back-btn")
  back_button.onclick = open_all_levels_main_menu

  let button = menu.querySelector("#play-new-game-btn")
  let name_input = menu.querySelector("#game-name-input")
  let error = menu.querySelector("#game-name-error")
  error.innerText = ""
  name_input.value = ""
  button.onclick = _ => {
    let name = name_input.value;
    if (name.length == 0) {
      error.innerText = "Please enter at least one character"
    }
    else if (!is_name_free(name, game_state)) {
      error.innerText = "Game with this name already exists"
    }
    else {
      error.innerText = ""
      let game = create_new_game(name, levels)
      play_game(game, game_state, levels)
      generate_all_levels_menu(game_state, levels, play_game)
    }
  }
}

function show_ranking(ranking) {
  open_menu('ranking-wrapper')
  let close_btn = document.getElementById("close-ranking-btn")
  close_btn.onclick = _ => close_menu('ranking-wrapper')

  let element = document.createElement("table")
  document.getElementById("ranking").innerHTML = ""
  document.getElementById("ranking").appendChild(element)

  if (ranking.length == 0)
    element.innerHTML += "<tr> *cricket noises* There's no one in the ranking </tr>"
  else {
    element.innerHTML = "<thead><tr> <th>Name</th> <th>Score</th> </tr></thead>"
    for (let entry of ranking) {
      let row = document.createElement("tr")
      row.innerHTML += `<td>${entry.name}</td> <td>${entry.score}</td>`
      element.appendChild(row)
    }
  }

}
