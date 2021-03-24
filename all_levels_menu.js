// Module 2 menu 
//  - selection of any (predefined) level
//  - game is automatically saved
//  - (TODO) Ranking


// Adds CSS class to the element which makes it colored basing on difficulty
function add_difficulty_class(element, difficulty)
{
  if (difficulty == EASY) element.classList.add('easy')
  if (difficulty == MEDIUM) element.classList.add('medium')
  if (difficulty == HARD) element.classList.add('hard')
}


function create_level_button(level_number, level)
{
  let button = document.createElement("button")
  button.classList.add("btn")
  button.textContent = level_number
  add_difficulty_class(button, level.difficulty)
  return button
}

function draw_preview_on_wrapper(level, preview_wrapper)
{
  let preview = draw_level(level).element
  preview_wrapper.style.display = "block"
  preview.classList.add("level-preview")
  preview_wrapper.innerHTML = ""
  preview_wrapper.appendChild(preview)  
}


function generate_all_levels_menu(game_state, original_levels, play_at_level)
{
  let menu = document.getElementById("all-levels-menu")
  let buttons = menu.querySelector(".grid-buttons")
  let preview_wrapper = menu.querySelector(".level-preview-wrapper")

  let saver = new SaveToCookie(game_state)

  for (let level_number = 1; level_number <= original_levels.length; level_number++)
  {
    let original_level = original_levels[level_number - 1]
    let button = create_level_button(level_number, original_level)

    button.onmouseover = _ => {
      let level = get_current_level_state(original_level.index, game_state, original_levels)
      draw_preview_on_wrapper(level, preview_wrapper)
    }
    
    button.onmouseout = _ => {
      preview_wrapper.style.display = "none"
    }

    button.onclick = () => {
      hide_all_levels_menu(); 
      let level_to_play = get_current_level_state(original_level.index, game_state, original_levels)
      play_at_level(level_to_play, original_level, saver)
    }

    buttons.appendChild(button)
  }
}
