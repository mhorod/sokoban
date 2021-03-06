// Module 2 menu 
//  - selection or creation of new game
//  - game is automatically saved
//  - ranking of completed games

ALL_LEVELS_MAIN_MENU = 'all-levels-main-menu'
CONTINUE_GAME_MENU = 'continue-game-menu'
NEW_GAME_MENU = 'new-game-menu'

function create_button(text) {
  let button = document.createElement("button")
  button.classList.add("btn")
  button.textContent = text
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

  ranking_button.onclick = _ => show_ranking(game_state)
  continue_button.onclick = _ =>
    open_continue_game_menu(game_state, levels, play_game)
  new_game_button.onclick = _ => open_new_game_menu(game_state, levels)
}

function close_all_levels_menus() {
  hide(ALL_LEVELS_MAIN_MENU)
  hide(CONTINUE_GAME_MENU)
  hide(NEW_GAME_MENU)
}

function open_all_levels_main_menu() {
  close_all_levels_menus()
  show(ALL_LEVELS_MAIN_MENU)
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
  show(CONTINUE_GAME_MENU)
  let menu = document.getElementById(CONTINUE_GAME_MENU)

  let back_button = menu.querySelector(".back-btn")
  back_button.onclick = open_all_levels_main_menu

  let preview_wrapper = menu.querySelector(".level-preview-wrapper")
  preview_wrapper.innerHTML = ""

  let buttons = menu.querySelector(".menu-buttons")
  buttons.innerHTML = ""
  for (let game of game_state.saved_games) {
    let button = create_button(game.name)

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

function link_new_game_button(element, game_state, levels) {
  let error = document.getElementById("game-name-error")
  let name_input = document.getElementById("game-name-input")
  error.innerText = ""
  name_input.value = ""

  element.onclick = _ => {
    let name = name_input.value;
    if (name.length == 0) {
      error.innerText = "Please enter at least one character"
    }
    else if (!is_name_free(name, game_state)) {
      error.innerText = "Game with this name already exists"
    }
    else {
      error.innerText = ""
      let game = new Game(name, levels[0])
      play_game(game, game_state, levels)
      generate_all_levels_menu(game_state, levels, play_game)
    }
  }
}

function open_new_game_menu(game_state, levels) {
  close_all_levels_menus()
  show(NEW_GAME_MENU)
  let menu = document.getElementById(NEW_GAME_MENU)

  let back_button = menu.querySelector(".back-btn")
  back_button.onclick = open_all_levels_main_menu

  let new_game_button = document.getElementById("play-new-game-btn")
  link_new_game_button(new_game_button, game_state, levels)
}

function show_ranking(game_state) {
  let ranking = game_state.ranking
  show('ranking-wrapper')
  let close_btn = document.getElementById("close-ranking-btn")
  close_btn.onclick = _ => hide('ranking-wrapper')

  let element = document.createElement("table")
  document.getElementById("ranking").innerHTML = ""
  document.getElementById("ranking").appendChild(element)

  if (ranking.length == 0)
    element.innerHTML += "<tr> *cricket noises* There's no one in the ranking </tr>"
  else {
    element.innerHTML = "<thead><tr> <th>Name</th> <th>Score</th> <th></th></tr> </thead>"
    for (let entry of ranking) {
      let row = document.createElement("tr")
      row.innerHTML += `<td>${entry.name}</td> <td>${entry.score}</td>`
      row.innerHTML += `<td><button class="btn remove-ranking-entry">Remove</td></td>`
      element.appendChild(row)
      row.querySelector('.remove-ranking-entry').onclick = _ => {
        remove_from_ranking(entry, ranking)
        show_ranking(game_state)
        save_game_state(game_state)
      }
    }
  }

}
