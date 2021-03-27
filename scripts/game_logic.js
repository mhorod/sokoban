// Core game logic

/**
 * @typedef {{level: Level, display: LevelDisplay}} LevelData
 */

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

/**
 * Actions handled by game
 */
const Actions = {
  MOVE_LEFT: 0,
  MOVE_RIGHT: 1,
  MOVE_UP: 2,
  MOVE_DOWN: 3,
  RESTART: 4,
}

/** Converts action to coordinate offset
 * 
 * @param {any} action 
 * @return {[number, number]}
 */
function action_to_offset(action) {
  switch (action) {
    case Actions.MOVE_LEFT: return [-1, 0]
    case Actions.MOVE_RIGHT: return [1, 0]
    case Actions.MOVE_UP: return [0, -1]
    case Actions.MOVE_DOWN: return [0, 1]
  }
}

/**
 * Applies provided action using provided interface
 * @param {any} action Action to apply, any of Actions member
 * @param {LevelData} level_data 
 * @param {GameLogic} logic 
 * @return {boolean} true if action was applied false otherwise
 */
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

  if (is_level_completed(level)) {
    level.completed = true
  }

  logic.save_level(level)
  if (level.completed)
    logic.complete(level)
  return true
}

/** Pushes box by offset
 * 
 * @param {number} box_index 
 * @param {[number, number]} offset 
 * @param {LevelData} level_data 
 * @param {GameLogic} logic 
 */
function push_box(box_index, offset, level_data, logic) {
  let box = level_data.level.boxes[box_index]
  move_box_from(box_index, box, level_data, logic)
  box = level_data.level.boxes[box_index] = move(box, offset)
  level_data.display.move_box_to(box_index, box)
  move_box_to(box_index, box, level_data, logic)
}

/** Removes box from a tile
 * 
 * @param {number} box_index 
 * @param {[number, number]} offset 
 * @param {LevelData} level_data 
 * @param {GameLogic} logic 
 */
function move_box_from(box_index, position, level_data, logic) {
  let target_index = get_target_index(level_data.level, position)
  if (target_index != undefined) {
    level_data.display.set_target_has_box(target_index, false)
    level_data.display.set_box_is_satisfied(box_index, false)
    logic.satisfaction_counter.add(-1)
  }
}

/** Puts box on a tile
 * 
 * @param {number} box_index 
 * @param {[number, number]} offset 
 * @param {LevelData} level_data 
 * @param {GameLogic} logic 
 */
function move_box_to(box_index, position, level_data, logic) {
  let target_index = get_target_index(level_data.level, position)
  if (target_index != undefined) {
    level_data.display.set_target_has_box(target_index, true)
    level_data.display.set_box_is_satisfied(box_index, true)
    logic.satisfaction_counter.add(1)
  }
}
