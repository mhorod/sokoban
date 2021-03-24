// Sokoban game made for Motorola Science Cup
// Team: rybka *fish* plum


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
      let p = draw_level(level).element
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

function get_current_level_state(level_index, game_state, original_levels)
{
  for (let level of game_state.saved_levels)
    if (level.index == level_index) 
      return level;
  return original_levels[level_index]
}

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

class SatisfactionCounter
{
  constructor(max_satisfaction) 
  { 
    this.satisfaction = 0 
    this.max_satisfaction = max_satisfaction
    this.element = document.getElementById("satisfaction-counter")
    this.update_element()
  }

  add(change) 
  {
    this.satisfaction += change
    this.update_element()
  }

  update_element()
  {
    this.element.innerText = `Satisfied: ${this.satisfaction} / ${this.max_satisfaction}`
  }
}

function controls_handler(level, display, action, satisfaction_counter, game_saver) 
{
  let offset = action_to_offset(action)
  if (!can_move_or_push(level, offset)) return false 
  level.player = move(level.player, offset)
  move_element_to(display.player, level.player)

  let pushed_box_index = get_box_index(level, level.player)
  if (pushed_box_index != undefined)
  {
    let box = level.boxes[pushed_box_index]
    let box_display = display.boxes[pushed_box_index]
    
    let target_index = get_target_index(level, box)
    if (target_index != undefined)
    { 
      update_target_display(display.targets[target_index], false) 
      update_box_display(box_display, false)
      satisfaction_counter.add(-1)
    }

    box = level.boxes[pushed_box_index] = move(box, offset)
    move_element_to(box_display, box)

    let new_target_index = get_target_index(level, box)
    if (new_target_index != undefined)
    {
      update_target_display(display.targets[new_target_index], true)
      update_box_display(box_display, true)
      satisfaction_counter.add(1)
    }
  }
  game_saver.save(level)
  return true
}

function satisfied_boxes_count(level)
{
  let result = 0
  for (let box of level.boxes)
    if (is_box_satisfied(level, box)) result++
  return result
}

function play_at_level(level, original_level, game_saver)
{
  hide_all_menus()
  open_game()
  level = clone_level(level)
  let display = draw_level(level)

  document.getElementById("game").innerHTML = ""
  document.getElementById("game").appendChild(display.element)

  satisfaction_counter = new SatisfactionCounter(level.boxes.length)
  satisfaction_counter.add(satisfied_boxes_count(level))

  link_controls(action => controls_handler(level, display, action, satisfaction_counter, game_saver))
  document.getElementById("restart-button").onclick = 
      _ => 
      {
        game_saver.save(original_level) 
        play_at_level(original_level, original_level, game_saver)
      }  
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


link_menu_buttons()
check_cookies_accepted()
hide_all_menus()
open_main_menu()

levels = load_levels_from_string(LEVELS)

levels_by_difficulty = {
  easy: levels.filter(e => e.difficulty == EASY),
  medium: levels.filter(e => e.difficulty == MEDIUM),
  hard: levels.filter(e => e.difficulty == HARD),
}

game_state = load_game_state()
generate_difficulty_menu(levels_by_difficulty, play_at_level)
generate_all_levels_menu(game_state, levels, play_at_level)
generate_level_editor_menu(game_state.user_levels)

