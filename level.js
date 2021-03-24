// Level representation and manipulation

function deep_array_copy(array) 
{
  return JSON.parse(JSON.stringify(array));
}

function arrays_equal(first, second)
{
  if (first.length != second.length) return false;
  let r = first.every((el, index) => second[index] == el)
  return r
}

class Level
{
  constructor()
  {
    this.width = 0
    this.height = 0
    this.walls = []
    this.boxes = []
    this.targets = []
    this.player = [0, 0]
    this.difficulty = undefined
    this.index = undefined
  }
}

function clone_level(level)
{
  let obj = new Level()
  obj.width = level.width;
  obj.height = level.height;
  obj.walls = deep_array_copy(level.walls)
  obj.boxes = deep_array_copy(level.boxes)
  obj.targets = deep_array_copy(level.targets) 
  obj.player = deep_array_copy(level.player)  
  obj.difficulty = deep_array_copy(level.difficulty)  
  obj.index = deep_array_copy(level.index)  
  return obj
}

function get_box_index(level, box)
{
  for (let i = 0; i < level.boxes.length; i++)
    if (arrays_equal(level.boxes[i], box)) 
      return i 
}

function is_box_satisfied(level, box)
{
  return level.targets.some(target => arrays_equal(target, box))
}

function get_target_index(level, target)
{
  for (let i = 0; i < level.targets.length; i++)
    if (arrays_equal(level.targets[i], target)) 
      return i 
}
