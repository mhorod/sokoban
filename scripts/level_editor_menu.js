function generate_level_editor_menu(levels)
{
  let menu = document.getElementById("level-editor-menu")
  let buttons = menu.getElementsByClassName("grid-buttons")[0]
  let preview = menu.querySelector(".level-preview-wrapper")
  let level_number = 1;
  let add_new_level_button = menu.querySelector("#add-new-level")
  add_new_level_button.onclick = _ => {
    let level = create_new_level()
    levels.push(level)
    generate_level_editor_menu(levels)
  }

  for (let level of levels)
  {
    let button = document.createElement("button")
    button.classList.add("btn")
    button.textContent = level_number
    button.onmouseover = _ => {
      preview.style.display = "block"
      let p = draw_level(level).element
      p.classList.add("level-preview")
      preview.innerHTML = ""
      preview.appendChild(p)
    }

    button.onmouseout = _ => {
      preview.style.display = "none"
    }

    button.onclick = _ => edit_level(level)
    level_number += 1
    buttons.appendChild(button)
  }
}
