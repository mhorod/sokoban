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

function deep_array_copy(array) {
  if (array == undefined) return undefined
  return JSON.parse(JSON.stringify(array));
}

function arrays_equal(first, second) {
  if (first == undefined || second == undefined) return false
  if (first.length != second.length) return false;
  let r = first.every((el, index) => second[index] == el)
  return r
}

function is_level_completed(level) {
  return level.boxes.every(box => is_box_satisfied(level, box))
}

function get_box_index(level, box) {
  for (let i = 0; i < level.boxes.length; i++)
    if (arrays_equal(level.boxes[i], box))
      return i
}

function is_box_satisfied(level, box) {
  return level.targets.some(target => arrays_equal(target, box))
}

function get_target_index(level, target) {
  for (let i = 0; i < level.targets.length; i++)
    if (arrays_equal(level.targets[i], target))
      return i
}

function satisfied_boxes_count(level) {
  let result = 0
  for (let box of level.boxes)
    if (is_box_satisfied(level, box)) result++
  return result
}


function remove_wall(level, wall) {
  remove_level_object(level.walls, wall)
}

function remove_target(level, target) {
  remove_level_object(level.targets, target)
}

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

function can_push_box(level, box_position, offset) {
  let [x, y] = box_position
  let [dx, dy] = offset
  x += dx
  y += dy
  return can_walk_into_without_pushing(level, [x, y]);
}

function can_move_or_push(level, offset) {
  let [x, y] = level.player
  let [dx, dy] = offset

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