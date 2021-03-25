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
