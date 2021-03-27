// Level editor features
// (in progress)

LEVEL_EDITOR_WRAPPER = 'level-editor-wrapper'
LEVEL_EDITOR = 'level-editor'

EDITED_LEVEL = 'edited-level-wrapper'
EDITED_LEVEL_PLAY = 'edited-level-play'

const Mode = {
  Place: 0,
  Erase: 1,
}
const Element = {
  Floor: 0,
  Target: 1,
  Box: 2,
  Player: 3,
}

/** Creates sample level to edit
 * 
 * @param {number} width 
 * @param {number} height 
 */
function create_new_level(width = 5, height = 5) {
  let level = new Level()
  level.width = width
  level.height = height
  level.player = [2, 2]
  level.targets.push([2, 1])
  level.boxes.push([2, 3])
  return level
}


function edit_level(level, game_state) {
  level = clone_level(level)

  close_all_menus()
  show(LEVEL_EDITOR_WRAPPER)
  show(LEVEL_EDITOR)
  hide(EDITED_LEVEL_PLAY)

  let level_editor = document.getElementById(LEVEL_EDITOR)
  level_editor.querySelector('.back-btn').onclick = _ => {
    hide(LEVEL_EDITOR_WRAPPER)
    open_level_editor_main_menu()
  }

  let name_input = level_editor.querySelector('#level-name-input')
  name_input.value = level.name

  let width_input = level_editor.querySelector('#level-width')
  let height_input = level_editor.querySelector('#level-height')
  let resize_level_button = level_editor.querySelector('#resize-level-btn')
  width_input.value = level.width
  height_input.value = level.height
  resize_level_button.onclick = _ => {
    resize_level_or_show_error(level, width_input.value, height_input.value)
    level_display = draw_level(level, on_tile_click)
    place_display(document.getElementById(EDITED_LEVEL), level_display.element)
  }

  let play_button = level_editor.querySelector('#play-edited-level-btn')
  play_button.onclick =
    _ => {
      if (validate_level_or_show_error(level))
        play_edited_level(level, game_state)
    }

  let error = document.getElementById('edited-level-error')
  let success = document.getElementById('saved-edited-level')
  hide('saved-edited-level')
  hide('edited-level-error')

  let save_button = level_editor.querySelector('#save-level-btn')
  save_button.onclick = _ => {
    let name = name_input.value
    let existsting_level = get_user_level_by_name(name, game_state)
    if (name.length == 0) {
      error.innerHTML = 'Please enter at least one character'
      hide('saved-edited-level')
      show('edited-level-error')
    }
    else if (existsting_level != undefined && existsting_level.index != level.index) {
      error.innerHTML = 'Level with this name already exists'
      hide('saved-edited-level')
      show('edited-level-error')
    }
    else if (validate_level_or_show_error(level)) {
      level.name = name
      save_user_level(level, game_state)
      generate_level_editor_menu(game_state)
      save_game_state(game_state)
      error.innerHTML = ''
      show('saved-edited-level')
    }
  }

  let remove_button = level_editor.querySelector('#remove-level-btn')
  remove_button.onclick = _ => {
    remove_user_level(level, game_state)
    save_game_state(game_state)
    generate_level_editor_menu()
    hide(LEVEL_EDITOR)
    show(LEVEL_EDITOR_MENU)
    show(LEVEL_EDITOR_EDIT_MENU)
  }

  let mode_buttons = level_editor.querySelector('#mode-buttons').querySelectorAll('.btn')
  let element_buttons = level_editor.querySelector('#element-buttons').querySelectorAll('.btn')
  reset_buttons_state(mode_buttons, element_buttons)

  let current_mode = 0
  let current_element = 0

  for (let i = 0; i < mode_buttons.length; i++)
    mode_buttons[i].onclick = _ => {
      mode_buttons[current_mode].classList.remove('active')
      mode_buttons[i].classList.add('active')
      current_mode = i
    }

  for (let i = 0; i < element_buttons.length; i++)
    element_buttons[i].onclick = _ => {
      element_buttons[current_element].classList.remove('active')
      element_buttons[i].classList.add('active')
      current_element = i
    }


  let on_tile_click =
    tile => {
      hide('saved-edited-level')
      hide('edited-level-error')
      apply_edition(level, tile, current_mode, current_element)
      level_display = draw_level(level, on_tile_click)
      place_display(document.getElementById(EDITED_LEVEL), level_display.element)
    }

  level_display = draw_level(level, on_tile_click)
  place_display(document.getElementById(EDITED_LEVEL), level_display.element)
}


/** Resets level editor buttons to defautl state i.e. 'place floor'
 * 
 * @param {HTMLElement[]} mode_buttons 
 * @param {HTMLElement[]} element_buttons 
 */
function reset_buttons_state(mode_buttons, element_buttons) {
  for (let btn of mode_buttons)
    btn.classList.remove('active')
  mode_buttons[0].classList.add('active')

  for (let btn of element_buttons)
    btn.classList.remove('active')
  element_buttons[0].classList.add('active')
}


function validate_level_or_show_error(level) {
  if (!is_level_valid(level)) {
    let error = 'The level is invalid. <br> Level has to contain a player, at least one box, and as many boxes as targets'
    show_level_editor_error(error)
    return false
  }

  hide('edited-level-error')
  return true
}

function show_level_editor_error(innerHTML) {
  let error = document.getElementById('edited-level-error')
  error.innerHTML = innerHTML
  show('edited-level-error')
  hide('saved-edited-level')
}


/** Check whether the level is valid i.e.
  * Is player specified and there are as many boxes as targets
  */
function is_level_valid(level) {
  if (level.player === undefined) return false
  if (level.boxes.length == 0) return false
  if (level.boxes.length != level.targets.length) return false
  return true
}

/** Tries to change element at tile in given mode
 * 
 * @param {Level} level 
 * @param {[number, number]} tile 
 * @param {number} mode 
 * @param {number} element 
 */
function apply_edition(level, tile, mode, element) {
  if (mode == Mode.Place)
    place(level, tile, element)
  else
    erase(level, tile, element)
}

/** Tries to place element at tile
 * 
 * @param {Level} level 
 * @param {[number, number]} tile 
 * @param {number} element 
 */
function place(level, tile, element) {
  if (element == Element.Floor) {
    remove_wall(level, tile)
    remove_target(level, tile)
  }
  else if (element == Element.Target) {
    remove_wall(level, tile)
    remove_target(level, tile)
    level.targets.push(tile)
  }
  else if (element == Element.Box) {
    if (can_walk_into_without_pushing(level, tile)
      && !arrays_equal(tile, level.player))
      level.boxes.push(tile)
  }
  else if (element == Element.Player) {
    if (can_walk_into_without_pushing(level, tile))
      level.player = tile
  }
}

/** Tries to erase element at tile
 * 
 * @param {Level} level 
 * @param {[number, number]} tile 
 * @param {number} element 
 */
function erase(level, tile, element) {
  if (element == Element.Floor) {
    remove_target(level, tile)
    remove_box(level, tile)
    remove_wall(level, tile)
    level.walls.push(tile)
  }
  else if (element == Element.Target) {
    let index = get_target_index(level, tile)
    if (index != undefined)
      level.targets.splice(index, 1)
  }
  else if (element == Element.Box) {
    let index = get_box_index(level, tile)
    if (index != undefined)
      level.boxes.splice(index, 1)
  }
  else if (element == Element.Player) {
    if (arrays_equal(level.player, tile))
      level.player = undefined
  }
}
/** Plays level without saving and upon completion goes back to editing
 * 
 * @param {Level} level 
 * @param {GameState} game_state 
 */
function play_edited_level(level, game_state) {
  show('edited-level-play')
  hide(LEVEL_EDITOR)
  element = document.getElementById('edited-level-play')
  element.querySelector('.back-btn').onclick =
    _ => edit_level(level, game_state)
  play_single_level(
    element,
    level,
    level,
    new DontSave(),
    _ => { },
    _ => {
      edit_level(level, game_state)
    },
  )
}

function resize_level_or_show_error(level, width_text, height_text) {
  let error = document.getElementById('edited-level-error')
  let width = parseInt(width_text)
  let height = parseInt(height_text)
  if (isNaN(width) || isNaN(height)) {
    error.innerText = 'Size has to be a number'
    show('edited-level-error')
  }
  else if (width < 1 || width > MAX_LEVEL_WIDTH || height < 1 || height > MAX_LEVEL_HEIGHT) {
    error.innerText = `Size has to be between 1x1 and ${MAX_LEVEL_WIDTH}x${MAX_LEVEL_HEIGHT}`
    show('edited-level-error')
  }
  else {
    resize_level(level, width, height)
    hide('edited-level-error')
  }
}