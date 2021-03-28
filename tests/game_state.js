// Tests of GameState operations

function test_game_state() {
  add_group("Game state")
  test(ranking_is_sorted_descending_after_entry_insertions)
  test(ranking_is_sorted_descending_after_entry_removals)
  test(saved_game_is_independent)
  test(saving_new_game_adds_it_to_saved_games)
  test(saving_existing_game_overwrites_existing_state)
  test(saved_user_level_is_independent)
  test(saved_paused_user_level_is_independent)
  test(saving_new_user_level_adds_it_to_user_levels)
  test(saving_existing_user_level_overwrites_existing_state)
  test(saving_user_level_that_is_paused_resets_its_state)
  test(removing_user_level_removes_it_from_levels_and_paused_levels)
  test(removing_paused_user_level_does_not_remove_it_from_user_levels)
  test(difficulty_of_split_levels_is_correct)
  test(levels_with_undefined_difficulty_are_ignored_in_splitting)
}


function ranking_is_sorted_descending_after_entry_insertions() {
  let ranking = []
  entries = [{ score: 123 }, { score: 200 }, { score: 50 }, { score: 150 }]
  for (let entry of entries)
    insert_into_ranking(entry, ranking)

  let expected_ranking = [
    { score: 200 },
    { score: 150 },
    { score: 123 },
    { score: 50 },
  ]

  return eq(ranking, expected_ranking)
}

function ranking_is_sorted_descending_after_entry_removals() {
  let ranking = []
  entries = [{ score: 123 }, { score: 200 }, { score: 50 }, { score: 150 }]
  for (let entry of entries)
    insert_into_ranking(entry, ranking)

  remove_from_ranking(ranking[0], ranking)
  remove_from_ranking(ranking[2], ranking)

  let expected_ranking = [
    { score: 150 },
    { score: 123 },
  ]

  return eq(ranking, expected_ranking)
}

function saved_game_is_independent() {
  let game_state = new GameState()
  let game = new Game("foo", new Level())
  save_game(game, game_state)
  return game_state.saved_games[0] != game
}

function saving_new_game_adds_it_to_saved_games() {
  let game_state = new GameState()
  let game = new Game("foo", new Level())
  save_game(game, game_state)
  return eq(game_state.saved_games[0], game)
}

function saving_existing_game_overwrites_existing_state() {
  let game_state = new GameState()
  let game = new Game("foo", new Level())
  save_game(game, game_state)
  game.score += 10
  game.level.player = [1, 1]
  save_game(game, game_state)
  return eq(game_state.saved_games[0], game)
}

function saved_user_level_is_independent() {
  let game_state = new GameState()
  let level = new Level()
  save_new_user_level(level, game_state)
  return game_state.user_levels[0] != level
}

function saved_paused_user_level_is_independent() {
  let game_state = new GameState()
  let level = new Level()
  save_new_user_level(level, game_state)
  save_paused_user_level(level, game_state)
  return game_state.paused_user_levels[0] != level
}

function saving_new_user_level_adds_it_to_user_levels() {
  let game_state = new GameState()
  let level = new Level()
  save_new_user_level(level, game_state)
  return eq(game_state.user_levels[0], level)
}

function saving_existing_user_level_overwrites_existing_state() {
  let game_state = new GameState()
  let level = new Level()
  save_user_level(level, game_state)
  level.width = level.height = 5
  level.boxes.push([1, 1])
  save_user_level(level, game_state)
  return eq(game_state.user_levels[0], level)
}

function saving_user_level_that_is_paused_resets_its_state() {
  let game_state = new GameState()
  let level = new Level()
  save_user_level(level, game_state)
  level.width = level.height = 5
  level.boxes.push([1, 1])
  save_user_level(level, game_state)
  return eq(game_state.paused_user_levels[0], level)
}

function removing_user_level_removes_it_from_levels_and_paused_levels() {
  let game_state = new GameState()
  let level = new Level()
  save_user_level(level, game_state)
  remove_user_level(level, game_state)
  return game_state.user_levels.length == 0 && game_state.paused_user_levels.length == 0
}

function removing_paused_user_level_does_not_remove_it_from_user_levels() {
  let game_state = new GameState()
  let level = new Level()
  save_user_level(level, game_state)
  remove_paused_user_level(level, game_state)
  return game_state.user_levels.length == 1 && game_state.paused_user_levels.length == 0
}

function difficulty_of_split_levels_is_correct() {
  let levels = [new Level(), new Level(), new Level()]
  levels[2].difficulty = EASY
  levels[1].difficulty = MEDIUM
  levels[0].difficulty = HARD

  let split = split_levels_by_difficulty(levels)
  return split.easy[0] == levels[2] &&
    split.medium[0] == levels[1] &&
    split.hard[0] == levels[0]
}

function levels_with_undefined_difficulty_are_ignored_in_splitting() {

  let levels = [new Level(), new Level(), new Level(), new Level(), new Level()]
  levels[2].difficulty = EASY
  levels[1].difficulty = MEDIUM
  levels[0].difficulty = HARD

  let split = split_levels_by_difficulty(levels)
  return split.easy.length == 1 &&
    split.medium.length == 1 &&
    split.hard.length == 1
}
