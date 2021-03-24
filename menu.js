
function link_menu_buttons()
{
  link_main_menu_buttons()
}

function link_main_menu_buttons()
{
  document.getElementById("accept-cookies-btn").onclick = accept_cookies
  document.getElementById("main-menu-btn").onclick = back_to_main_menu
  document.getElementById("play-by-difficulty-btn").onclick = open_difficulty_menu
  document.getElementById("play-all-levels-btn").onclick = open_all_levels_menu
  document.getElementById("level-editor-btn").onclick = open_level_editor_menu
}

function back_to_main_menu()
{
  hide_all_menus()
  open_main_menu()
}

function hide_all_menus()
{
  hide_game()
  hide_level_editor()

  hide_main_menu()
  hide_difficulty_menu()
  hide_all_levels_menu()
  hide_level_editor_menu()
}

function hide_level_editor()
{
  document.getElementById("level-editor-wrapper").style.display = "none"
}

function open_level_editor()
{
  document.getElementById("level-editor-wrapper").style.display = "block"
}

function hide_game()
{
  document.getElementById("game-wrapper").style.display = "none"
}

function open_game()
{
  document.getElementById("game-wrapper").style.display = "block"
}

function open_main_menu()
{
  document.getElementById("main-menu-btn").style.display = "none"
  document.getElementById("main-menu").style.display = "block"
}

function hide_main_menu()
{
  document.getElementById("main-menu").style.display = "none"
}


function open_difficulty_menu()
{
  hide_main_menu()
  document.getElementById("main-menu-btn").style.display = "block"
  document.getElementById("difficulty-menu").style.display = "block"
}

function hide_difficulty_menu()
{
  document.getElementById("difficulty-menu").style.display = "none"
}

function open_all_levels_menu()
{
  hide_main_menu()
  document.getElementById("main-menu-btn").style.display = "block"
  document.getElementById("all-levels-menu").style.display = "block"
}

function hide_all_levels_menu()
{
  document.getElementById("all-levels-menu").style.display = "none"
}

function open_level_editor_menu()
{
  hide_main_menu()
  document.getElementById("main-menu-btn").style.display = "block"
  document.getElementById("level-editor-menu").style.display = "block"
}

function hide_level_editor_menu()
{
  document.getElementById("level-editor-menu").style.display = "none"
}
