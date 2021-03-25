// Menu of level editor

LEVEL_EDITOR_MAIN_MENU = 'level-editor-main-menu'
function generate_level_editor_menu(levels) {
  let menu = document.getElementById("level-editor-menu")

  let back_button = menu.querySelector(".back-btn")
  back_button.onclick = back_to_main_menu
}


function open_level_editor_main_menu() {
  close_level_editor_menus()
  open_menu(LEVEL_EDITOR_MAIN_MENU)
}

function close_level_editor_menus() {

}