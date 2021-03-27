// Main game module connecting core logic with HTML UI

GAME_FINISHED = 'game-finished-wrapper'
FINISH_GAME_BTN = 'finish-game-btn'
SATISFACTION_COUNTER = 'satisfaction-counter'
RESTART_BTN = 'restart-btn'
GAME_WRAPPER = 'game-wrapper'
GAME = 'game'


/** Keeps track of how many boxes are on the targets
* and displays it on the proper element
*/
class SatisfactionCounter {
  constructor(max_satisfaction, element) {
    this.satisfaction = 0
    this.max_satisfaction = max_satisfaction
    this.element = element
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

/** 
 * Starts level on the #game-wrapper element set in HTML
 */
function play_level_on_default_game_wrapper(
  level,
  original_level,
  level_saver,
  on_level_completed,
  after_level_completed
) {

  let element = document.getElementById("game-wrapper")

  play_game_music()
  close_all_menus()
  open_game()
  link_back_to_main_menu_button(element)

  play_single_level(
    element,
    level,
    original_level,
    level_saver,
    on_level_completed,
    after_level_completed)
}

/**
 * 
 * @param {HTMLElement} element Element to put ui on 
 * @param {Level} level Initial state of the level
 * @param {Level} original_level Default (reset) state of the level
 * @param {LevelSaver} level_saver Object that saves levels
 * @param {function} on_level_completed Callback immediately on level completed
 * @param {function} after_level_completed Callback after user presses 'continue'
 */
function play_single_level(
  element,
  level,
  original_level,
  level_saver,
  on_level_completed,
  after_level_completed) {

  let ui = create_level_ui()
  let ui_wrapper = element.querySelector('.level-ui-wrapper')
  ui_wrapper.innerHTML = ""
  ui_wrapper.appendChild(ui)

  let level_data = { level: clone_level(level), display: draw_level(level) }
  let restart_button = ui.querySelector('.restart-btn')

  let logic = new BasicGameLogic(level_saver)
  logic.restart = restart_button.onclick =
    create_restart_function(
      element,
      original_level,
      level_saver,
      on_level_completed,
      after_level_completed)

  logic.complete = (level) => {
    on_level_completed(level)
    show_level_completed(level, after_level_completed)
  }

  logic.satisfaction_counter =
    create_satisfaction_counter(
      level,
      ui.querySelector('.satisfaction-counter'))

  play_level_at(element.querySelector('.level-wrapper'), level_data, logic)
}

/** Creates a basic level interface
 * 
 *  The interface consists of:
 *    - satisfaction counter
 *    - level display
 *    - information about controls
 *    - restart button
 */
function create_level_ui() {
  let ui = document.createElement('div')
  ui.classList.add('level-ui')

  let satisfaction_counter = document.createElement('div')
  satisfaction_counter.classList.add('satisfaction-counter')

  let level = document.createElement('div')
  level.classList.add('level-wrapper')

  let controls_text = document.createElement('span')
  controls_text.classList.add('controls-text')
  controls_text.innerHTML = 'Use arrows, WASD, or HJKL to move around <br> Press R to restart'

  let restart_button = document.createElement('button')
  restart_button.classList.add('restart-btn', 'btn')
  restart_button.innerHTML =
    `<ion-icon name="refresh-outline"></ion-icon>
     <span class="text"> Restart </span>`

  ui.appendChild(satisfaction_counter)
  ui.appendChild(level)
  ui.appendChild(controls_text)
  ui.appendChild(restart_button)

  return ui
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {LevelData} level_data 
 * @param {GameLogic} logic 
 */
function play_level_at(
  element,
  level_data,
  logic,
) {
  place_display(element, level_data.display.element)
  link_controls(action => apply_game_action(action, level_data, logic))
}

function place_display(element, display_element) {
  element.innerHTML = ''
  element.appendChild(display_element)
}

function show_level_completed(level, after_level_completed) {
  let wrapper = document.getElementById('level-completed-wrapper')
  wrapper.classList.add('shown')
  document.getElementById('level-completed-continue-btn').onclick = _ => {
    wrapper.classList.remove('shown')
    after_level_completed(level)
  }
}

function create_satisfaction_counter(level, element) {
  let satisfaction_counter = new SatisfactionCounter(level.boxes.length, element)
  satisfaction_counter.add(satisfied_boxes_count(level))
  return satisfaction_counter
}

function link_back_to_main_menu_button(game_element) {
  game_element.querySelector('.back-btn').onclick = _ => {
    unlink_controls()
    hide(GAME_WRAPPER)
    back_to_main_menu()
  }
}

function create_restart_function(
  element,
  original_level,
  level_saver,
  on_level_completed,
  after_level_completed) {
  return _ => {
    level_saver.save_level(original_level),
      play_single_level(
        element,
        clone_level(original_level),
        original_level,
        level_saver,
        on_level_completed,
        after_level_completed)
  }
}


// Play (continue) game - all levels sorted from easy to hard
function play_game(game, game_state, levels) {

  let game_saver = new BasicGameSaver(game, game_state)
  game_saver.save_game(game)
  let level = game.level;

  let on_level_completed = (level) => {
    game.score += level_score(level)
    let next = level.index + 1
    if (next < levels.length) {
      game.level = levels[next]
      game_saver.save_game(game)
    }
    else
      game_saver.finish_game(game)
  }

  let after_level_completed = (level) => {
    if (level.index + 1 < levels.length)
      play_game(game, game_state, levels)
    else
      finish_game(game, game_state, levels)
  }

  play_level_on_default_game_wrapper(
    level,
    levels[level.index],
    game_saver,
    on_level_completed,
    after_level_completed
  )

  let finish_button = document.getElementById("finish-game-btn")
  finish_button.onclick =
    _ => {
      game_saver.finish_game(game)
      finish_game(game, game_state, levels)
    }


}

// Displays information after finishing the game
function show_finish_game_modal(game, game_state) {
  show(GAME_FINISHED)
  let score = document.getElementById('finished-game-score')
  score.innerText = `Score: ${game.score}`

  let continue_button = document.getElementById('game-finished-continue-btn')
  let view_ranking_button = document.getElementById('game-finished-view-ranking-btn')

  continue_button.onclick = _ => {
    hide(GAME_FINISHED)
    back_to_main_menu()
  }

  view_ranking_button.onclick = _ => {
    hide(GAME_FINISHED)
    show_ranking(game_state)
  }
}

// Finishes game, it can be caused either by user
// or when all levels are completed
function finish_game(game, game_state, levels) {
  unlink_controls()
  close_game()
  back_to_main_menu()
  generate_all_levels_menu(game_state, levels, play_game)
  show_finish_game_modal(game, game_state, levels)
}


function level_score(level) {
  if (!level.completed) return 0
  let score = level.boxes.length * difficulty_bonus(level.difficulty)
  score *= score
  score /= level.moves // penalty for many moves
  return Math.round(score * 1000)
}

function difficulty_bonus(difficulty) {
  if (difficulty == EASY) return 1;
  if (difficulty == MEDIUM) return 4;
  if (difficulty == HARD) return 16;
}

function open_game() { show('game-wrapper') }
function close_game() { hide('game-wrapper') }

