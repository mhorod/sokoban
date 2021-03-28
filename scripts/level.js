// Level representation and manipulation

// As in specification ~
MAX_LEVEL_WIDTH = 30
MAX_LEVEL_HEIGHT = 20

/**
 * Represents a single level
 */
class Level {
  constructor() {
    this.width = 0
    this.height = 0
    this.walls = []
    this.boxes = []
    this.targets = []
    this.player = undefined
    this.difficulty = undefined
    this.index = undefined
    this.name = ""
    this.completed = false
    this.moves = 0
  }
}

/** Creates an independent copy of the level
 * 
 * @param {Level} level 
 */
function clone_level(level) {
  let obj = new Level()
  obj.width = level.width;
  obj.height = level.height;
  obj.walls = deep_array_copy(level.walls)
  obj.boxes = deep_array_copy(level.boxes)
  obj.targets = deep_array_copy(level.targets)
  obj.player = deep_array_copy(level.player)
  obj.difficulty = level.difficulty
  obj.index = level.index
  obj.name = level.name
  obj.completed = level.completed
  obj.moves = level.moves
  return obj
}

/** Deeply copies an array
 * 
 * @param {any[]} array 
 * @returns {any[]} deep copy of the array
 */
function deep_array_copy(array) {
  if (array == undefined) return undefined
  return JSON.parse(JSON.stringify(array));
}

/** Checks if arrays contain elements equal with == operator
 * 
 * @param {any[]} first 
 * @param {any[]} second 
 * @returns {boolean}
 */
function arrays_equal(first, second) {
  if (first == undefined || second == undefined) return false
  if (first.length != second.length) return false;
  let r = first.every((el, index) => second[index] == el)
  return r
}

/** Checks if given level is completed (all box are satisfied)
 *  
 * @param {Level} level 
 * @returns {boolean}  true if level is completed, false otherwise 
 */
function is_level_completed(level) {
  return level.boxes.every(box => is_box_satisfied(level, box))
}

/** Returns index of box in the level
 * 
 * @param {Level} level 
 * @param {number[]} box Position of the box
 * @returns {number}
 */
function get_box_index(level, box) {
  for (let i = 0; i < level.boxes.length; i++)
    if (arrays_equal(level.boxes[i], box))
      return i
}

/** Checks if given box is satisfied (there's a target on its position)
 * 
 * @param {Level} level 
 * @param {number[]} box 
 * @returns {boolean}
 */
function is_box_satisfied(level, box) {
  return level.targets.some(target => arrays_equal(target, box))
}

/** Returns index of target in the level
 * 
 * @param {Level} level 
 * @param {number[]} target Position of the target
 * @returns {number}
 */
function get_target_index(level, target) {
  for (let i = 0; i < level.targets.length; i++)
    if (arrays_equal(level.targets[i], target))
      return i
}

/** Counts how many boxes are satisfied
 * 
 * @param {Level} level 
 * @returns {number}
 */
function satisfied_boxes_count(level) {
  let result = 0
  for (let box of level.boxes)
    if (is_box_satisfied(level, box)) result++
  return result
}

/** Removes a wall from given position if there's any
 * 
 * @param {Level} level 
 * @param {number} wall 
 */
function remove_wall(level, wall) {
  remove_level_object(level.walls, wall)
}

/** Removes a target from given position if there's any
 * 
 * @param {Level} level 
 * @param {number} target 
 */
function remove_target(level, target) {
  remove_level_object(level.targets, target)
}

/** Removes a box from given position if there's any
 * 
 * @param {Level} level 
 * @param {number} box
 */
function remove_box(level, box) {
  remove_level_object(level.boxes, box)
}

function remove_level_object(array, object) {
  let index = undefined
  for (let i = 0; i < array.length; i++)
    if (arrays_equal(array[i], object)) index = i

  if (index != undefined)
    array.splice(index, 1)
}

/** Checks if given position allows to be put on it.
 *  Position cannot be wall and cannot contain a box 
 *  
 *  Does not consider player because only player can move elements around
 *  and there's only one player
 *  
 * @param {Levels} level 
 * @param {number[]} position 
 * @returns {boolean}
 */
function can_walk_into_without_pushing(level, position) {
  let [x, y] = position

  // Forbid leaving the board
  if (x < 0 || x >= level.width || y < 0 || y >= level.height) return false

  // And walking into walls
  else if (level.walls.some(wall => wall[0] == x && wall[1] == y)) return false

  // or boxes
  else if (level.boxes.some(box => box[0] == x && box[1] == y)) return false

  else
    return true
}
/** Checks whether box can be pushed by offset
 * 
 * @param {LeveL} level 
 * @param {number[]} box_position 
 * @param {number[]} offset 
 * @returns {boolean}
 */
function can_push_box(level, box_position, offset) {
  let [x, y] = box_position
  let [dx, dy] = offset
  x += dx
  y += dy
  return can_walk_into_without_pushing(level, [x, y]);
}

/** Checks whether player can move by offset
 * 
 * @param {Level} level 
 * @param {number} offset 
 * @returns {boolean}
 */
function can_move_or_push(level, offset) {
  let [x, y] = level.player
  let [dx, dy] = offset

  if (dx * dy != 0 || Math.abs(dx) > 1 || Math.abs(dy) > 1)
    return false

  x += dx
  y += dy

  if (can_walk_into_without_pushing(level, [x, y])) return true
  // If there's a box we can move only when we push it
  else if (level.boxes.some(box => box[0] == x && box[1] == y)) { return can_push_box(level, [x, y], offset) }

  else
    return false;
}

function move(position, offset) {
  let [x, y] = position
  let [dx, dy] = offset
  return [x + dx, y + dy]
}

/** Resizes level and removes elements that are no longer inside
 * 
 * @param {Level} level 
 * @param {number} width 
 * @param {number} height 
 */
function resize_level(level, width, height) {
  level.width = width
  level.height = height
  level.walls = level.walls.filter(e => e[0] < width && e[1] < height)
  level.targets = level.targets.filter(e => e[0] < width && e[1] < height)
  level.boxes = level.boxes.filter(e => e[0] < width && e[1] < height)
  if (level.player != undefined && (level.player[0] >= width || level.player[1] >= height))
    level.player = undefined
}