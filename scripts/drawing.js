// Functions related to drawing level on the screen

TILE_SIZE = 40
function px(n) { return String(n) + "px" }

class BasicLevelDisplay {

  constructor(element, player, targets, boxes) {
    this.element = element
    this.player = player
    this.targets = targets
    this.boxes = boxes
  }

  move_player_to(position) {
    this.move_element_to(this.player, position)
  }

  move_box_to(box_index, position) {
    this.move_element_to(this.boxes[box_index], position)
    play_move_box_sound()
  }

  set_target_has_box(target_index, has_box) {
    set_target_has_box(this.targets[target_index], has_box)
  }

  set_box_is_satisfied(box_index, is_satisfied) {
    set_box_is_satisfied(this.boxes[box_index], is_satisfied)
    if (is_satisfied)
      play_box_satisfied_sound()
  }

  move_element_to(element, position) {
    let [x, y] = position
    x *= TILE_SIZE
    y *= TILE_SIZE
    element.style.left = px(x)
    element.style.top = px(y)
  }
}


function draw_level(level) {
  let element = document.createElement("div")
  element.classList.add("level")
  if (level.width == 0 || level.height == 0)
    return new BasicLevelDisplay(element)

  let tiles = new Array(level.width)
  element.style.width = px(level.width * TILE_SIZE)
  element.style.height = px(level.height * TILE_SIZE + TILE_SIZE / 2)

  for (let x = 0; x < level.width; x++) {
    tiles[x] = new Array(level.height)
    for (let y = 0; y < level.height; y++) {
      let tile = new_empty_tile_at(x, y)
      tile.classList.add("tile-floor")
      tiles[x][y] = tile
      element.appendChild(tile)
    }
  }

  for (let [x, y] of level.walls) {
    tiles[x][y].remove()
  }

  let targets = []
  for (let [x, y] of level.targets) {
    tiles[x][y].classList.remove("tile-floor")
    tiles[x][y].classList.add("tile-target")
    targets.push(tiles[x][y])
  }

  let boxes = []
  for (let [x, y] of level.boxes) {
    let box = new_box_at(x, y)
    if (is_box_satisfied(level, [x, y])) {
      set_target_has_box(tiles[x][y], true)
      set_box_is_satisfied(box, true)
    }
    element.appendChild(box)
    boxes.push(box)
  }

  let player = new_player_at(level.player[0], level.player[1])
  element.appendChild(player)

  return new BasicLevelDisplay(element, player, targets, boxes)
}

function new_empty_tile_at(x, y) {
  let tile = document.createElement("div")
  tile.classList.add("tile")
  size_and_position_element(tile, x, y)
  tile.style.height = px(1.5 * TILE_SIZE)
  return tile
}

function new_box_at(x, y) {
  let box = document.createElement("div")
  box.classList.add("box")
  size_and_position_element(box, x, y)
  return box
}

function new_player_at(x, y) {
  let player = document.createElement("div")
  player.classList.add("player")
  size_and_position_element(player, x, y)
  return player
}

function size_and_position_element(element, x, y) {
  element.style.width = px(TILE_SIZE)
  element.style.height = px(TILE_SIZE)
  move_element_to(element, [x, y])
}

function move_element_to(element, position) {
  let [x, y] = position
  x *= TILE_SIZE
  y *= TILE_SIZE
  element.style.left = px(x)
  element.style.top = px(y)
}

function set_target_has_box(target, has_box) {
  if (has_box)
    target.classList.add("has-box")
  else
    target.classList.remove("has-box")
}

function set_box_is_satisfied(box, is_satisfied) {
  if (is_satisfied)
    box.classList.add("is-satisfied")
  else
    box.classList.remove("is-satisfied")
}

function play_move_box_sound() {
  let audio = new Audio("sounds/move_box.mp3")
  audio.play()
}

function play_box_satisfied_sound() {
  let audio = new Audio("sounds/box_satisfied.mp3")
  audio.play()
}

function play_game_music() {
}

function stop_game_music() {
}