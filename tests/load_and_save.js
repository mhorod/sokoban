
class TestingLoaderSaver {
  constructor() {
    this.game_state = undefined
    this.games = new Map()
    this.user_levels = new Map()
    this.paused_user_levels = new Map()
  }
  load_game_state() { return this.game_state }
  load_game(name) { return this.games.get(name) }
  load_user_level(name) { return this.user_levels.get(name) }
  load_paused_user_level(name) { return this.paused_user_levels.get(name) }

  save_game_state(_, serialized) { this.game_state = serialized }
  save_game(name, serialized) { this.games.set(name, serialized) }
  save_user_level(name, serialized) { this.user_levels.set(name, serialized) }
  save_paused_user_level(name, serialized) { this.paused_user_levels.set(name, serialized) }
}

function test_loading_and_saving() {
  add_group("Loading and saving")
  test(deserialized_level_is_equal_to_level)
  test(deserialized_game_is_equal_to_game)
  test(loaded_game_state_is_equal_to_saved)
  test(loaded_game_state_is_empty_if_no_game_state_is_saved)
}

function deserialized_level_is_equal_to_level() {
  let serializer = new BasicSerializer()
  let deserializer = new BasicDeserializer()
  let level = new Level()
  level.width = level.height = 5
  level.player = [1, 1]
  level.boxes = [[0, 0]]
  level.targets = [[2, 2]]
  level.walls = [[0, 1]]

  let restored_level = deserializer.deserialize_level(serializer.serialize_level(level))
  return eq(level, restored_level)
}

function deserialized_game_is_equal_to_game() {
  let serializer = new BasicSerializer()
  let deserializer = new BasicDeserializer()

  let level = new Level()
  level.width = level.height = 5
  level.player = [1, 1]
  level.boxes = [[0, 0]]
  level.targets = [[2, 2]]
  level.walls = [[0, 1]]

  let game = new Game("foo", level)
  let restored_game = deserializer.deserialize_game(serializer.serialize_game(game))
  return eq(game, restored_game)
}

function loaded_game_state_is_equal_to_saved() {
  let game_state = new GameState()
  let level = new Level()
  level.width = level.height = 5
  level.boxes = [[0, 0]]

  let game = new Game("foo", level)
  let level2 = clone_level(level)
  level.targets = [[0, 1]]

  insert_into_ranking({ name: "xyz", score: 123 }, game_state.ranking)
  save_game(game, game_state)
  save_user_level(level2, game_state)
  level2.player = [2, 2]
  save_paused_user_level(level2, game_state)

  let saver = new TestingLoaderSaver()
  let serializer = new BasicSerializer()
  let deserializer = new BasicDeserializer()

  save_game_state(game_state, serializer, saver)
  let restored_game_state = load_game_state(deserializer, saver)

  return eq(restored_game_state, game_state)
}

function loaded_game_state_is_empty_if_no_game_state_is_saved() {
  let game_state = load_game_state(
    deserializer = new BasicDeserializer,
    loader = new TestingLoaderSaver())
  let expected_game_state = new GameState()
  return eq(game_state, expected_game_state)
}