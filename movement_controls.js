let action_queue = []

let can_apply_move_instantly = true

let current_event_listener = undefined

const Actions = {
    MOVE_LEFT: 0,
    MOVE_RIGHT: 1,
    MOVE_UP: 2,
    MOVE_DOWN: 3,
    RESTART: 4,
}

function apply_action(handler, action) {
    action_queue.push(action)
    if (can_apply_move_instantly) { next_queued_action(handler) }
}

// handler should take an action as parameter and return whether
// it has suceeded or not
function next_queued_action(handler) {
    if (action_queue.length === 0) {
        can_apply_move_instantly = true
        return
    }
    can_apply_move_instantly = false
    while (action_queue.length > 0 && !handler(action_queue.shift()));
    setTimeout(() => next_queued_action(handler), 100)
}


function unlink_controls()
{
  document.removeEventListener("keydown", current_event_listener)
}

function link_controls(handler)
{
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



function action_to_offset(action)
{
  switch (action) {
    case Actions.MOVE_LEFT: return [-1, 0]
    case Actions.MOVE_RIGHT: return [1, 0]
    case Actions.MOVE_UP: return [0, -1]
    case Actions.MOVE_DOWN: return [0, 1]
  }
}
