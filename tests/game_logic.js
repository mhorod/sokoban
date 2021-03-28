// Tests of game logic interface

// Prerequisites allowing for easier testing
class TestingDisplay {
  constructor() {
    this.events = []
  }

  move_player_to(position) {
    this.events.push(['MP', position])
  }
  move_box_to(box_index, position) {
    this.events.push(['MB', box_index, position])
  }
  set_target_has_box(target_index, has_box) {
    this.events.push(['ST', target_index, has_box])
  }
  set_box_is_satisfied(box_index, is_satisfied) {
    this.events.push(['SB', box_index, is_satisfied])
  }
}

class TestingSatisfactionCounter {
  constructor(satisfaction) { this.satisfaction = satisfaction }
  add(change) { this.satisfaction += change }
}


class TestingLogic {
  constructor() {
    this.events = []
    this.satisfaction_counter = new TestingSatisfactionCounter()
  }
  restart() { this.events.push('R') }
  complete(level) { this.events.push('C') }
  save_level(level) { this.events.push('S') }
}


function apply_game_actions(actions, level_data, logic) {
  for (let action of actions)
    apply_game_action(action, level_data, logic)
}

function test_game_logic_on_level(level, actions) {
  let display = new TestingDisplay()
  let level_data = { level: level, display: display }
  let logic = new TestingLogic()
  apply_game_actions(actions, level_data, logic)
  return [display.events, logic.events]
}


function test_game_logic() {
  add_group('Game logic')
  test(actions_are_saved_after_each_move)
  test(invalid_actions_are_ignored)
  test(level_completes_on_satisfying_all_boxes)
  test(actions_after_level_completion_are_ignored)
  test(player_can_restart_level)
}

function actions_are_saved_after_each_move() {
  let actions = [
    Actions.MOVE_RIGHT,
    Actions.MOVE_DOWN,
    Actions.MOVE_LEFT,
    Actions.MOVE_DOWN,
    Actions.MOVE_RIGHT,
    Actions.MOVE_RIGHT,
    Actions.MOVE_UP,
    Actions.MOVE_UP]

  let level = new Level()
  level.width = level.height = 4
  level.player = [0, 0]
  level.boxes = [[3, 0]]

  let [display_events, logic_events] = test_game_logic_on_level(level, actions)

  let expected_display_events = [
    ['MP', [1, 0]],
    ['MP', [1, 1]],
    ['MP', [0, 1]],
    ['MP', [0, 2]],
    ['MP', [1, 2]],
    ['MP', [2, 2]],
    ['MP', [2, 1]],
    ['MP', [2, 0]]
  ]

  let expected_logic_events = ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S']
  let expected_player_position = [2, 0]
  let expected_level_moves = 8

  return eq(expected_player_position, level.player) &&
    eq(expected_display_events, display_events) &&
    eq(expected_logic_events, logic_events) &&
    expected_level_moves == level.moves
}

function invalid_actions_are_ignored() {
  let actions = [
    Actions.MOVE_UP,
    Actions.MOVE_LEFT,
    Actions.MOVE_DOWN,
    Actions.MOVE_RIGHT,
    Actions.MOVE_RIGHT]

  let level = new Level()
  level.width = level.height = 3
  level.boxes = [[1, 1]]
  level.player = [0, 0]

  let expected_display_events = [
    ['MP', [0, 1]],
    ['MP', [1, 1]],
    ['MB', 0, [2, 1]]
  ]
  let expected_logic_events = ['S', 'S']
  let expected_player_position = [1, 1]
  let expected_level_moves = 2

  let [display_events, logic_events] = test_game_logic_on_level(level, actions)
  return eq(expected_player_position, level.player) &&
    eq(expected_display_events, display_events) &&
    eq(expected_logic_events, logic_events) &&
    expected_level_moves == level.moves
}

function level_completes_on_satisfying_all_boxes() {
  let actions = [
    Actions.MOVE_DOWN,
    Actions.MOVE_RIGHT,
    Actions.MOVE_RIGHT]

  let level = new Level()
  level.width = level.height = 3
  level.boxes = [[1, 1], [0, 1]]
  level.targets = [[2, 1], [0, 2]]
  level.player = [0, 0]

  let expected_display_events = [
    ['MP', [0, 1]],
    ['MB', 1, [0, 2]],
    ['ST', 1, true],
    ['SB', 1, true],
    ['MP', [1, 1]],
    ['MB', 0, [2, 1]],
    ['ST', 0, true],
    ['SB', 0, true]
  ]
  let expected_logic_events = ['S', 'S', 'C']
  let expected_player_position = [1, 1]
  let expected_level_moves = 2

  let [display_events, logic_events] = test_game_logic_on_level(level, actions)

  return eq(expected_player_position, level.player) &&
    eq(expected_display_events, display_events) &&
    eq(expected_logic_events, logic_events) &&
    expected_level_moves == level.moves &&
    level.completed
}

function actions_after_level_completion_are_ignored() {
  let actions = [
    Actions.MOVE_DOWN,
    Actions.MOVE_RIGHT,
    Actions.MOVE_RIGHT,
    Actions.MOVE_LEFT,
    Actions.MOVE_UP]

  let level = new Level()
  level.width = level.height = 3
  level.boxes = [[1, 1], [0, 1]]
  level.targets = [[2, 1], [0, 2]]
  level.player = [0, 0]

  let expected_display_events = [
    ['MP', [0, 1]],
    ['MB', 1, [0, 2]],
    ['ST', 1, true],
    ['SB', 1, true],
    ['MP', [1, 1]],
    ['MB', 0, [2, 1]],
    ['ST', 0, true],
    ['SB', 0, true]
  ]
  let expected_logic_events = ['S', 'S', 'C']
  let expected_player_position = [1, 1]
  let expected_level_moves = 2

  let [display_events, logic_events] = test_game_logic_on_level(level, actions)

  return eq(expected_player_position, level.player) &&
    eq(expected_display_events, display_events) &&
    eq(expected_logic_events, logic_events) &&
    expected_level_moves == level.moves &&
    level.completed
}

function player_can_restart_level() {
  let actions = [
    Actions.RESTART,
    Actions.MOVE_RIGHT,
    Actions.RESTART]

  let level = new Level()
  level.width = level.height = 3
  level.boxes = [[1, 1], [0, 1]]
  level.targets = [[2, 1], [0, 2]]
  level.player = [0, 0]

  let expected_display_events = [
    ['MP', [1, 0]],
  ]
  let expected_logic_events = ['R', 'S', 'R']
  let expected_player_position = [1, 0]
  let expected_level_moves = 1

  let [display_events, logic_events] = test_game_logic_on_level(level, actions)
  return eq(expected_player_position, level.player) &&
    eq(expected_display_events, display_events) &&
    eq(expected_logic_events, logic_events) &&
    expected_level_moves == level.moves
}