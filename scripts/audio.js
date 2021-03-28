
function play_move_box_sound() {
  let audio = new Audio("sounds/move_box.mp3")
  audio.play()
}

function play_box_satisfied_sound() {
  let audio = new Audio("sounds/box_satisfied.mp3")
  audio.play()
}

function play_game_music() {
  let element = document.getElementById("game-music")
  if (!element.paused) return
  element.play()
}

function stop_game_music() {
  let element = document.getElementById("game-music")
  element.currentTime = 0
  element.pause()
}

function mute_game_music() {
  let audio = document.getElementById("game-music")
  audio.muted = true
  let element = document.getElementById("volume-switch")
  element.querySelectorAll(".btn")[0].classList.add('hidden')
  element.querySelectorAll(".btn")[1].classList.remove('hidden')
}

function unmute_game_music() {
  let audio = document.getElementById("game-music")
  audio.muted = false
  let element = document.getElementById("volume-switch")
  element.querySelectorAll(".btn")[0].classList.remove('hidden')
  element.querySelectorAll(".btn")[1].classList.add('hidden')
}