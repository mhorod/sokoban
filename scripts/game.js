// Main game module connecting core logic with HTML UI

// Keeps track of how many boxes are on the targets
// and displays on the proper element
class SatisfactionCounter {
  constructor(max_satisfaction) {
    this.satisfaction = 0
    this.max_satisfaction = max_satisfaction
    this.element = document.getElementById("satisfaction-counter")
    this.update_element()
  }

  add(change) {
    this.satisfaction += change
    this.update_element()
  }

  update_element() {
    this.element.innerText = `Satisfied: ${this.satisfaction} / ${this.max_satisfaction}`
  }
}

class BasicGameLogic {
  constructor(game_saver) { this.game_saver = game_saver }
  save_level(level) { this.game_saver.save_level(level) }
}


// Function used to play a single level
function play_at_level(
  level,
  original_level,
  level_saver,
  on_level_completed) {
  close_all_menus()
  open_game()
  link_back_to_main_menu_button(document.getElementById("game-ui"))

  level = clone_level(level)
  let level_data = { level: level, display: draw_level(level) }
  place_display(document.getElementById("game"), level_data.display.element)
  let restart_button = document.getElementById("restart-btn")

  let logic = new BasicGameLogic(level_saver)
  logic.restart = restart_button.onclick =
    create_restart_function(original_level, level_saver, on_level_completed)
  logic.complete = (level) => { show_level_completed(level, on_level_completed) }
  logic.satisfaction_counter = create_satisfaction_counter(level)
  link_controls(action => apply_game_action(action, level_data, logic))
}

function place_display(element, display_element) {
  element.innerHTML = ""
  element.appendChild(display_element)
}

function show_level_completed(level, on_level_completed) {
  let wrapper = document.getElementById("level-completed-wrapper")
  wrapper.classList.add("shown")
  document.getElementById("level-completed-continue-btn").onclick = _ => {
    wrapper.classList.remove("shown")
    on_level_completed(level)
  }
}

function create_satisfaction_counter(level) {
  let satisfaction_counter = new SatisfactionCounter(level.boxes.length)
  satisfaction_counter.add(satisfied_boxes_count(level))
  return satisfaction_counter
}

function link_back_to_main_menu_button(game_element) {
  game_element.querySelector(".back-btn").onclick = _ => {
    unlink_controls()
    back_to_main_menu()
  }
}

function create_restart_function(
  original_level,
  level_saver,
  on_level_completed) {
  return _ => {
    level_saver.save_level(original_level),
      play_at_level(original_level,
        original_level,
        level_saver,
        on_level_completed)
  }
}


function play_game(game, game_state, levels) {
  document.getElementById("finish-game-btn").classList.add("shown")
  document.getElementById("finish-game-btn").onclick =
    _ => finish_game(game, game_state, levels)
  let game_saver = new SaveToCookie(game, game_state)
  game_saver.save_game(game)
  let level = game.level;

  let on_level_completed = (level) => {
    game.score += level_score(level)
    let next = level.index + 1
    if (next < levels.length)
      play_at_level(levels[next], levels[next], game_saver, on_level_completed)
    else
      finish_game(game, game_state, levels)
  }

  play_at_level(level, levels[level.index], game_saver, on_level_completed)
}

function show_finish_game_modal(game, game_state) {
  let modal = document.getElementById("game-finished-wrapper")
  open_menu("game-finished-wrapper")
  let score = modal.querySelector("#finished-game-score")
  score.innerText = `Score: ${game.score}`

  let continue_button = document.getElementById("game-finished-continue-btn")
  let view_ranking_button = document.getElementById("game-finished-view-ranking-btn")

  continue_button.onclick = _ => {
    back_to_main_menu()
    close_menu("game-finished-wrapper")
  }

  view_ranking_button.onclick = _ => {
    close_menu("game-finished-wrapper")
    show_ranking(game_state.ranking)
  }
}

function finish_game(game, game_state, levels) {
  unlink_controls()
  back_to_main_menu()
  let ranking_entry = {
    name: game.name,
    score: game.score,
  }

  game_index = game_state.saved_games.indexOf(game)
  game_state.saved_games.splice(game_index, 1)
  game_state.ranking.push(ranking_entry)
  game_state.ranking.sort((a, b) => a.score < b.score)
  save_game_state(game_state)

  generate_all_levels_menu(game_state, levels, play_game)
  show_finish_game_modal(game, game_state)
}

function level_score(level) {
  if (!level.completed) return 0
  let score = level.boxes.length * difficulty_bonus(level.difficulty) / level.moves
  return Math.round(score * 1000)
}

function difficulty_bonus(difficulty) {
  if (difficulty == EASY) return 1;
  if (difficulty == MEDIUM) return 2;
  if (difficulty == HARD) return 4;
}

