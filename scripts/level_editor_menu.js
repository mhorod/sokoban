// Menu of level editor

LEVEL_EDITOR_MAIN_MENU = 'level-editor-main-menu'
LEVEL_EDITOR_PLAY_MENU = 'level-editor-play-menu'
LEVEL_EDITOR_EDIT_MENU = 'level-editor-edit-menu'


function generate_level_editor_menu(game_state) {
  let menu = document.getElementById("level-editor-menu")

  let play_button = document.getElementById("level-editor-play-btn")
  let edit_button = document.getElementById("level-editor-edit-btn")
  if (game_state.user_levels.length == 0) {
    hide('level-editor-play-btn')
    hide('level-editor-edit-btn')
  }
  else {
    show('level-editor-play-btn')
    show('level-editor-edit-btn')

  }

  let new_level_button = document.getElementById("add-new-level-btn")
  new_level_button.onclick = _ => {
    edit_level(create_new_level(), game_state)
  }
  let back_button = menu.querySelector(".back-btn")
  back_button.onclick = back_to_main_menu

  play_button.onclick = _ => {
    hide_level_editor_menus()
    show(LEVEL_EDITOR_PLAY_MENU)
  }
  edit_button.onclick = _ => {
    hide_level_editor_menus()
    show(LEVEL_EDITOR_EDIT_MENU)
  }

  generate_level_editor_play_menu(game_state)
  generate_level_editor_edit_menu(game_state)
}

function open_level_editor_main_menu() {
  hide_level_editor_menus()
  show(LEVEL_EDITOR_MAIN_MENU)
}

function open_level_editor_main_menu() {
  hide_level_editor_menus()
  show(LEVEL_EDITOR_MENU)
  show(LEVEL_EDITOR_MAIN_MENU)
}

function hide_level_editor_menus() {
  hide(LEVEL_EDITOR_MAIN_MENU)
  hide(LEVEL_EDITOR_PLAY_MENU)
  hide(LEVEL_EDITOR_EDIT_MENU)
}


function generate_level_editor_level_buttons(levels, menu, onclick) {
  let buttons = menu.querySelector('.menu-buttons')
  let preview_wrapper = menu.querySelector('.level-preview-wrapper')
  buttons.innerHTML = ""

  for (let level of levels) {
    let button = create_button(level.name)
    button.onmouseover = _ =>
      show_level_preview(preview_wrapper, draw_level(level).element)

    button.onmouseout = _ => hide_level_preview(preview_wrapper)

    button.onclick = _ => onclick(level)
    buttons.appendChild(button)
  }
}

class SavePausedUserLevels {
  constructor(game_state) { this.game_state = game_state }
  save_level(level) {
    save_paused_user_level(level, this.game_state)
    save_game_state(this.game_state)
    generate_level_editor_play_menu(this.game_state)
  }
}

function generate_level_editor_play_menu(game_state) {
  let menu = document.getElementById("level-editor-play-menu")

  let back_button = menu.querySelector(".back-btn")
  back_button.onclick = open_level_editor_main_menu

  let after_level_completed = _ => {
    hide("game-wrapper")
    back_to_main_menu()
  }

  generate_level_editor_level_buttons(
    game_state.paused_user_levels,
    menu,
    (level) => {
      play_level_on_default_game_wrapper(
        level,
        get_user_level_by_index(level.index, game_state),
        new SavePausedUserLevels(game_state),
        _ => {
          save_paused_user_level(get_user_level_by_index(level.index, game_state), game_state)
          save_game_state(game_state)
          generate_level_editor_menu(game_state)
        },
        after_level_completed
      )
    }
  )
}

function generate_level_editor_edit_menu(game_state) {
  let menu = document.getElementById("level-editor-edit-menu")

  let back_button = menu.querySelector(".back-btn")
  back_button.onclick = open_level_editor_main_menu


  generate_level_editor_level_buttons(
    game_state.user_levels,
    menu,
    (level) => { edit_level(level, game_state) }
  )

}