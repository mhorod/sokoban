// Sokoban game made for Motorola Science Cup
// Team: rybka *fish* plum

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

function controls_handler(
    level, 
    display, 
    action, 
    satisfaction_counter, 
    level_saver,
    on_complete
)
{
  if (level.completed) return false;

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
  
  if (is_level_completed(level))
  {
    level.completed = true
    on_complete(level)
  }

  level_saver.save_level(level)
  return true
}

function satisfied_boxes_count(level)
{
  let result = 0
  for (let box of level.boxes)
    if (is_box_satisfied(level, box)) result++
  return result
}


function play_at_level(
    level, 
    original_level, 
    level_saver, 
    on_level_completed)
{
  close_all_menus()
  open_game()
  level = clone_level(level)
  let display = draw_level(level)
  
  let on_complete = (level) => {
    document.getElementById("level-completed-wrapper").classList.add("shown")
    document.getElementById("level-completed-continue-btn").onclick = _ =>
    {
      document.getElementById("level-completed-wrapper").classList.remove("shown")
        on_level_completed(level)
    }

  }

  document.getElementById("game").innerHTML = ""
  document.getElementById("game").appendChild(display.element)

  satisfaction_counter = new SatisfactionCounter(level.boxes.length)
  satisfaction_counter.add(satisfied_boxes_count(level))

  link_controls(action => 
    controls_handler(
      level, 
      display,
      action, 
      satisfaction_counter, 
      level_saver,
      on_complete))
  
  document.getElementById("restart-btn").onclick = 
      _ => 
      {
        level_saver.save_level(original_level) 
        play_at_level(
          original_level, 
          original_level, 
          level_saver,
          on_level_completed)
      }  
}

function play_game(game, game_state, levels)
{
  let game_saver = new SaveToCookie(game, game_state)
  game_saver.save_game(game)
  let level = game.level;
  let on_level_completed = (level) => {
    let next = level.index + 1
    if (next < levels.length)
      play_at_level(levels[next], levels[next], game_saver, on_level_completed)
  }
  play_at_level(level, levels[level.index], game_saver, on_level_completed)
}


function create_new_level()
{
  let level = new Level();
  level.width = level.height = 10;
  return level
}

function edit_level(level)
{
  close_all_menus()
  open_level_editor()
  let level_display = draw_level(level)
  document.getElementById("edited-level-wrapper").innerHTML = ""
  document.getElementById("edited-level-wrapper").appendChild(level_display)
}

