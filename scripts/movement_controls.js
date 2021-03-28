// Part responsible for capturing user input

let action_queue = []

let can_apply_move_instantly = true

let current_event_listener = undefined


// The process used by two below function smoothes movement a little bit
// Player cannot zoom through the board or cut corners

NEXT_ACTION_TIMEOUT = 100 // Time (in miliseconds) between two consecutive actions
MAX_ACTIONS_IN_QUEUE = 3 // How many actions can be in queue, if queue is full events are ignored

/** Queues action to be handled and handles it as soon as it's possible
 * 
 * @param {Function} handler 
 * @param {any} action 
 */
function apply_action(handler, action) {
  if (action_queue.length < MAX_ACTIONS_IN_QUEUE)
    action_queue.push(action)
  if (can_apply_move_instantly) { next_queued_action(handler) }
}

/** Processes actions.
 *  When there are no waiting actions, the next one can be applied immediately.
 *  Otherwise try to apply every action until the first success
 * 
 *  @param {Function} handler 
 */
function next_queued_action(handler) {
  if (action_queue.length === 0) {
    can_apply_move_instantly = true
    return
  }
  can_apply_move_instantly = false
  while (action_queue.length > 0 && !handler(action_queue.shift()));
  setTimeout(() => next_queued_action(handler), NEXT_ACTION_TIMEOUT)
}

/**
 * Removes previously set binding of keyboard events
 */
function unlink_controls() {
  document.removeEventListener("keydown", current_event_listener)
}

/** Binds keyboard events to game actions, and calls provided handler on action 
 * 
 * @param {function} handler 
 */
function link_controls(handler) {
  unlink_controls()
  action_queue = []
  current_event_listener = e => {
    if (e.code === "KeyA" || e.code === "KeyH" || e.code === "ArrowLeft")
      apply_action(handler, Actions.MOVE_LEFT)
    else if (e.code === "KeyD" || e.code === "KeyL" || e.code === "ArrowRight")
      apply_action(handler, Actions.MOVE_RIGHT)
    else if (e.code === "KeyW" || e.code === "KeyK" || e.code === "ArrowUp")
      apply_action(handler, Actions.MOVE_UP)
    else if (e.code === "KeyS" || e.code === "KeyJ" || e.code === "ArrowDown")
      apply_action(handler, Actions.MOVE_DOWN)
    else if (e.code == "KeyR")
      apply_action(handler, Actions.RESTART)
  }
  document.addEventListener("keydown", current_event_listener)
}