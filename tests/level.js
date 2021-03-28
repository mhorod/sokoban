// Tests of level and its operations

function test_level() {
  add_group('Level')
  test(level_clone_is_independent)
  test(level_with_all_boxes_on_targets_is_completed)
  test(level_with_one_box_not_on_target_is_not_completed)
  test(level_with_all_boxes_on_targets_is_completed)
  test(level_with_one_box_not_on_target_is_not_completed)
  test(satisfied_boxes_count_is_equal_to_number_of_boxes_on_targets)
  test(box_is_not_satisfied_after_its_target_removal)
  test(can_walk_into_empty_tile_without_pushing)
  test(can_walk_into_empty_target_without_pushing)
  test(cannot_walk_into_box_without_pushing)
  test(cannot_walk_into_wall)
  test(cannot_leave_level_area)
  test(can_push_box_into_empty_tile)
  test(can_push_box_into_empty_target)
  test(cannot_push_box_into_box)
  test(cannot_push_box_into_wall)
  test(cannot_push_box_outside_level_area)

  test(player_can_move_to_adjacent_tile)
  test(player_cannot_move_diagonally)
  test(player_can_move_when_there_is_space)
  test(player_cannot_move_when_there_is_no_space)
  test(player_can_push_box_when_there_is_space)
  test(player_cannot_push_box_when_there_is_no_space)
}

function level_clone_is_independent() {
  let level = new Level()
  level.width = level.height = 10
  level.walls = [[1, 1]]
  level.boxes = [[0, 0]]
  level.targets = [[2, 2]]
  level.player = [3, 3]

  let clone = clone_level(level)
  level.width = 9
  clone.height = 11
  level.walls.push([1, 3])
  clone.walls.push([1, 2])
  clone.boxes.splice(0, 1)
  clone.player[0] = 4
  clone.targets.pop()

  if (
    JSON.stringify(level.walls) == JSON.stringify(clone.walls) ||
    JSON.stringify(level.boxes) == JSON.stringify(clone.boxes) ||
    JSON.stringify(level.targets) == JSON.stringify(clone.targets) ||
    JSON.stringify(level.player) == JSON.stringify(clone.player) ||
    level.width == clone.width ||
    level.height == clone.height
  ) return false

  return true
}

function level_with_all_boxes_on_targets_is_completed() {
  let level = new Level()
  level.boxes = [[0, 0], [1, 1]]
  level.targets = [[0, 0], [1, 1]]
  return is_level_completed(level)
}

function level_with_one_box_not_on_target_is_not_completed() {
  let level = new Level()
  level.boxes = [[0, 1], [1, 1]]
  level.targets = [[0, 0], [1, 1]]
  return !is_level_completed(level)
}

function box_that_is_on_target_is_satisfied() {
  let level = new Level()
  level.boxes = [[0, 0]]
  level.targets = [[0, 0]]
  return is_box_satisfied(level, [0, 0])
}

function box_that_is_not_on_target_is_not_satisfied() {
  let level = new Level()
  level.boxes = [[0, 1]]
  level.targets = [[0, 0]]
  return is_box_satisfied(level, [0, 1])
}

function satisfied_boxes_count_is_equal_to_number_of_boxes_on_targets() {
  let level1 = new Level()
  level1.boxes = [[0, 1]]
  level1.targets = [[0, 0]]

  let level2 = new Level()
  level2.boxes = [[0, 0], [0, 1], [2, 3]]
  level2.targets = [[2, 3], [0, 0]]
  return satisfied_boxes_count(level1) == 0 && satisfied_boxes_count(level2) == 2
}

function box_is_not_satisfied_after_its_target_removal() {
  let level = new Level()
  level.boxes = [[0, 0]]
  level.targets = [[0, 0]]
  remove_target(level, [0, 0])
  return !is_box_satisfied(level, [0, 0])
}

function can_walk_into_empty_tile_without_pushing() {
  let level = new Level()
  level.width = level.height = 2
  return can_walk_into_without_pushing(level, [0, 0])
}

function can_walk_into_empty_target_without_pushing() {
  let level = new Level()
  level.width = level.height = 2
  level.targets = [[0, 0]]
  return can_walk_into_without_pushing(level, [0, 0])
}

function cannot_walk_into_box_without_pushing() {
  let level = new Level()
  level.width = level.height = 2
  level.boxes = [[1, 0]]
  return !can_walk_into_without_pushing(level, [1, 0])
}

function cannot_walk_into_wall() {
  let level = new Level()
  level.width = level.height = 2
  level.walls = [[1, 1]]
  return !can_walk_into_without_pushing(level, [1, 1])
}

function cannot_leave_level_area() {
  let level = new Level()
  level.width = level.height = 1
  for (let x = -1; x < 2; x++)
    for (let y = -1; y < 2; y++) {
      if (x == 0 && y == 0) continue
      if (can_walk_into_without_pushing(level, [x, y])) return false
    }
  return true
}

function can_push_box_into_empty_tile() {
  let level = new Level()
  level.width = level.height = 2
  return can_push_box(level, [0, 0], [0, 1])
}

function can_push_box_into_empty_target() {
  let level = new Level()
  level.width = level.height = 2
  level.targets = [[1, 1]]
  return can_push_box(level, [1, 0], [0, 1])
}

function cannot_push_box_into_box() {
  let level = new Level()
  level.width = level.height = 2
  level.boxes = [[1, 1]]
  return !can_push_box(level, [1, 0], [0, 1])
}

function cannot_push_box_into_wall() {
  let level = new Level()
  level.width = level.height = 2
  level.walls = [[1, 1]]
  return !can_push_box(level, [1, 0], [0, 1])
}

function cannot_push_box_outside_level_area() {
  let level = new Level()
  level.width = level.height = 2
  return !can_push_box(level, [1, 0], [1, 0])
}

function player_can_move_to_adjacent_tile() {
  let level = new Level()
  level.width = level.height = 3
  level.player = [1, 1]
  offsets = [[0, 1], [0, -1], [-1, 0], [1, 0]]
  return offsets.every(offset => can_move_or_push(level, offset))
}

function player_cannot_move_diagonally() {
  let level = new Level()
  level.width = level.height = 3
  level.player = [1, 1]
  offsets = [[1, 1], [-1, -1], [-1, 1], [1, -1]]
  return offsets.every(offset => !can_move_or_push(level, offset))
}

function player_can_move_when_there_is_space() {
  let level1 = new Level()
  level1.width = level1.height = 3
  level1.player = [0, 1]

  let level2 = new Level()
  level2.width = level2.height = 3
  level2.player = [0, 1]
  level2.targets = [[1, 1]]

  return can_move_or_push(level1, [1, 0]) && can_move_or_push(level2, [1, 0])
}

function player_cannot_move_when_there_is_no_space() {
  let level1 = new Level()
  level1.width = level1.height = 3
  level1.walls = [[1, 1]]
  level1.player = [0, 1]

  let level2 = new Level()
  level2.width = level2.height = 3
  level2.boxes = [[1, 1], [2, 1]]
  level2.player = [0, 1]
  level2.targets = [[2, 1]]

  return !can_move_or_push(level1, [1, 0]) && !can_move_or_push(level2, [1, 0])
}

function player_can_push_box_when_there_is_space() {
  let level1 = new Level()
  level1.width = level1.height = 3
  level1.boxes = [[1, 1]]
  level1.player = [0, 1]

  let level2 = new Level()
  level2.width = level2.height = 3
  level2.boxes = [[1, 1]]
  level2.player = [0, 1]
  level2.targets = [[2, 1]]

  return can_move_or_push(level1, [1, 0]) && can_move_or_push(level2, [1, 0])
}

function player_cannot_push_box_when_there_is_no_space() {
  let level1 = new Level()
  level1.width = level1.height = 3
  level1.walls = [[2, 1]]
  level1.boxes = [[1, 1]]
  level1.player = [0, 1]

  let level2 = new Level()
  level2.width = level2.height = 3
  level2.boxes = [[1, 1], [2, 1]]
  level2.player = [0, 1]
  level2.targets = [[2, 1]]

  return !can_move_or_push(level1, [1, 0]) && !can_move_or_push(level2, [1, 0])
}
