// Links buttons to proper functions
function generate_difficulty_menu(levels_by_difficulty, play_at_level)
{
  let menu = document.getElementById("difficulty-menu")
  let easy = menu.querySelector("#easy-btn")
  let medium = menu.querySelector("#medium-btn")
  let hard = menu.querySelector("#hard-btn")

  let saver = new DontSave()
  easy.onclick = () => {
    let level = levels_by_difficulty.easy.sample()
    play_at_level(level, level, saver)
  }

  medium.onclick = () => {
    let level = levels_by_difficulty.medium.sample()
    play_at_level(level, level, saver)
  }

  hard.onclick = () => {
    let level = levels_by_difficulty.hard.sample()
    play_at_level(level, level, saver)
  }
}
