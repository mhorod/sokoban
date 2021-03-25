MAIN_MENU = 'main-menu'
RANDOM_LEVEL_MENU = 'random-level-menu'
ALL_LEVELS_MENU = 'all-levels-menu'
LEVEL_EDITOR_MENU = 'level-editor-menu'


function link_menu_buttons()
{
  link_main_menu_buttons()
}

function link_main_menu_buttons()
{
  document.getElementById("accept-cookies-btn").onclick = accept_cookies
  document.getElementById("main-menu-btn").onclick = back_to_main_menu
  document.getElementById("play-random-btn").onclick = open_random_level_menu
  document.getElementById("play-all-levels-btn").onclick = open_all_levels_menu
  document.getElementById("level-editor-btn").onclick = open_level_editor_menu
}

function back_to_main_menu()
{
  close_all_menus()
  open_main_menu()
}

function close_all_menus()
{
  close_game()
  close_level_editor_menu()  

  close_main_menu()
  close_random_level_menu()
  close_all_levels_menu()
  close_level_editor_menu()
}

function close_game()
{
  document.getElementById("game-wrapper").style.display = "none"
}

function open_game()
{
  document.getElementById("game-wrapper").style.display = "block"
}

function open_menu(id)
{
  document.getElementById(id).classList.add("shown")
}

function close_menu(id)
{
  document.getElementById(id).classList.remove("shown")
}

function open_main_menu()
{
  document.getElementById("main-menu-btn").style.display = "none"
  open_menu(MAIN_MENU)
}

function close_main_menu()
{
  close_menu(MAIN_MENU)
}

function open_random_level_menu()
{
  close_main_menu()
  document.getElementById("main-menu-btn").style.display = "block"
  open_menu(RANDOM_LEVEL_MENU)
}

function close_random_level_menu()
{
 close_menu(RANDOM_LEVEL_MENU)
}

function open_all_levels_menu()
{
  close_main_menu()
  document.getElementById("main-menu-btn").style.display = "block"
  open_menu(ALL_LEVELS_MENU) 
  open_all_levels_main_menu()
}

function close_all_levels_menu()
{
  close_menu(ALL_LEVELS_MENU)
}

function open_level_editor_menu()
{
  close_main_menu()
  document.getElementById("main-menu-btn").style.display = "block"
  open_menu(LEVEL_EDITOR_MENU)
}

function close_level_editor_menu()
{
  close_menu(LEVEL_EDITOR_MENU)
}
