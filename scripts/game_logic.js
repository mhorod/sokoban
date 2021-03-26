// Core game logic

// Note: Those two below classes are meant only to clarify used interface

// Level interface used by game
class LevelDisplay {
  move_player_to(position) { }
  move_box_to(box_index, position) { }
  set_target_has_box(target_index, has_box) { }
  set_box_is_satisfied(box_index, is_satisfied) { }
}

// Logic interface used by game
class GameLogic {
  restart() { }
  complete(level) { }
  save_level(level) { }
}

// Applies provided action using provided interface
// action - any of Action defined in movement_control
// level_data :
//    level - in-game level representation 
//    display - display implementing LevelDisplay methods
// logic - game logic implementing GameLogic methods 
// 
// returns true if action was applied and false if it failed
function apply_game_action(action, level_data, logic) {
  let level = level_data.level
  let display = level_data.display

  if (level.completed) return false
  if (action == Actions.RESTART) { logic.restart(); return false }

  let offset = action_to_offset(action)
  if (!can_move_or_push(level, offset)) return false

  level.moves += 1
  level.player = move(level.player, offset)
  display.move_player_to(level.player)

  let pushed_box_index = get_box_index(level, level.player)
  if (pushed_box_index != undefined)
    push_box(pushed_box_index, offset, level_data, logic)

  logic.save_level(level)
  if (is_level_completed(level)) {
    level.completed = true
    logic.complete(level)
  }

  return true
}

function push_box(box_index, offset, level_data, logic) {
  let box = level_data.level.boxes[box_index]
  move_box_from(box_index, box, level_data, logic)
  box = level_data.level.boxes[box_index] = move(box, offset)
  level_data.display.move_box_to(box_index, box)
  move_box_to(box_index, box, level_data, logic)
}

function move_box_from(box_index, position, level_data, logic) {
  let target_index = get_target_index(level_data.level, position)
  if (target_index != undefined) {
    level_data.display.set_target_has_box(target_index, false)
    level_data.display.set_box_is_satisfied(box_index, false)
    logic.satisfaction_counter.add(-1)
  }
}

function move_box_to(box_index, position, level_data, logic) {
  let target_index = get_target_index(level_data.level, position)
  if (target_index != undefined) {
    level_data.display.set_target_has_box(target_index, true)
    level_data.display.set_box_is_satisfied(box_index, true)
    logic.satisfaction_counter.add(1)
  }
}
