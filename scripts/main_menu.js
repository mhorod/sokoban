// Handles main menu and switching to sub-menus

MAIN_MENU = 'main-menu'
RANDOM_LEVEL_MENU = 'random-level-menu'
ALL_LEVELS_MENU = 'all-levels-menu'
LEVEL_EDITOR_MENU = 'level-editor-menu'


function link_menu_buttons() {
  link_main_menu_buttons()
}

function link_main_menu_buttons() {
  document.getElementById("accept-cookies-btn").onclick = accept_cookies
  document.getElementById("play-random-btn").onclick = open_random_level_menu
  document.getElementById("play-all-levels-btn").onclick = open_all_levels_menu
  document.getElementById("level-editor-btn").onclick = open_level_editor_menu
}

function back_to_main_menu() {
  close_all_menus()
  open_main_menu()
  stop_game_music()
}

function close_all_menus() {
  close_main_menu()
  close_random_level_menu()
  close_all_levels_menu()
  close_level_editor_menu()
}

function show(id) {
  document.getElementById(id).classList.add("shown")
  document.getElementById(id).classList.remove("hidden")
}

function hide(id) {
  document.getElementById(id).classList.add("hidden")
  document.getElementById(id).classList.remove("shown")
}


function open_main_menu() {
  show(MAIN_MENU)
}

function close_main_menu() {
  hide(MAIN_MENU)
}

function open_random_level_menu() {
  close_main_menu()
  show(RANDOM_LEVEL_MENU)
}

function close_random_level_menu() {
  hide(RANDOM_LEVEL_MENU)
}

function open_all_levels_menu() {
  close_main_menu()
  show(ALL_LEVELS_MENU)
  open_all_levels_main_menu()
}

function close_all_levels_menu() {
  hide(ALL_LEVELS_MENU)
}

function open_level_editor_menu() {
  close_main_menu()
  show(LEVEL_EDITOR_MENU)
  open_level_editor_main_menu()
}

function close_level_editor_menu() {
  hide(LEVEL_EDITOR_MENU)
}
