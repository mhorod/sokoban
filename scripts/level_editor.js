// Level editor features
// (in progress)

function create_new_level() {
  let level = new Level();
  level.width = level.height = 10;
  return level
}

function edit_level(level) {
  close_all_menus()
  open_level_editor()
  let level_display = draw_level(level)
  document.getElementById("edited-level-wrapper").innerHTML = ""
  document.getElementById("edited-level-wrapper").appendChild(level_display)
}

