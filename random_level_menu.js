// Menu for Module 1
//  - level is randomly selected based on chosen difficulty
//  - dummy saver is used hence game is not saved

class DontSave { save_level(){} }

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

function generate_random_level_menu(levels_by_difficulty, play_at_level)
{
  let menu = document.getElementById("random-level-menu")
  let easy = menu.querySelector("#easy-btn")
  let medium = menu.querySelector("#medium-btn")
  let hard = menu.querySelector("#hard-btn")
  

  let on_level_completed = _ => {
    back_to_main_menu() 
  }

  let saver = new DontSave()
  easy.onclick = () => {
    let level = levels_by_difficulty.easy.sample()
    play_at_level(level, level, saver, on_level_completed)
  }

  medium.onclick = () => {
    let level = levels_by_difficulty.medium.sample()
    play_at_level(level, level, saver, on_level_completed)
  }

  hard.onclick = () => {
    let level = levels_by_difficulty.hard.sample()
    play_at_level(level, level, saver, on_level_completed)
  }
}
