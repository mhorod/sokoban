// Source: https://www.sourcecode.se/sokoban/levels
// A.K.K. Informatika

LEVELS = 
`   ####
   #  #
   #  #
   #$.#
####  #
#     #
#@$.  #
#######
; Easy

########
#  #   #
#   $  #
#  #$$ #
## #   #
#.. $# #
#..   @#
########
; Easy

#######
#     #
# $ $ #
# $ $@#
# $$ ##
#  ...#
###...#
  #####
; Easy

 ########
 # @#   #
 # $  $ #
 #$ #######
## $#     #
#. . .    #
#.  #######
#####
; Easy

#########
#   #@  #
# # #  $##
#   $    #
## $ # # #
#...##   #
##########
; Easy

###########
#        @#
# #$ $ $  #
# # $$$$  #
# #$ $ $  #
# #     $ #
# #$### ###
# # #.....#
# # #.   .#
#    .....#
###########
; Easy

 ##############
 #            #
 #  $ $ $ $ $ #
 # # $ #####$ #
 # #$  #..#...#
 #   $ #..#.*.#
## #####..#..##
#         ##..#
# $ $ $@$  $$ #
###########   #
          #####
; Medium

 #####
 #.  #
 # $@#
 #. ##
### #########
# $ $ $ $   #
#      $    #
# ####### ###
#.   $   ..#
######## ..#
       #####
; Medium

     ##########
  ####    #   ###
  #  # $$ #     #
  #$ #   $#     #
###  #  $ #     #
#   $#$  $#*.####
#   $   $ #.....#
# $$$# $@$ .*...#
#    #    #.....#
#################
; Medium

#############
#           #
# $$ $ $ $  ###
#  $########  #
#   #.......$ #
# #$$......#  #
#@  # ## ### ##
### #  #      #
#    $ #   $  #
# #$#$ ###    #
#   #  # ######
########
; Medium

        #######
####### #     #
#     # #     #
# $ $ # #    ##
# $$  ### ## #
#  $$ #....# #
# $#  #....# #
#  # ###$### ##
# $ $ $... #$ #
#  #$ #...$   #
#  #@ ######  #
#######    ####
; Medium

  #########
  #.......########
  #.......   #   ##
#######   #$ # $$ #
# $      $   #    #
# $##  # ### # $$##
#   $$ #...# #   #
#    $ #...#$# $$#
# $$$  #.*.  $   #
#  $@$ ##$#$ #   #
######      ######
     ########
; Medium

   ####  ####
####  ####  ##
# $    #  $  #
# .#.#.$ #   #
# $*..#  #$$##
#  ###... $  #
# $ $....#$  #
#  #$$#  #   #
#@    ########
#######
; Medium

##########
#   #    #
#   #  $ #
# $.# $  #
# ..*.####
##$#.*.* #
#  $.#.$ #
# $  # $ #
#    #  @#
##########
; Medium

########### #####
#..     ..# #   #
#.$$$$$$$.###$$ #
# $..#..$  #    #
# $.$@$.$  # $$ #
# $..#..$  #  $ #
#.$$$$$$$.##$$  #
#..     ..#...###
##### ### #...#
    #   $ $...#
    ###########
; Hard

#######
#     ############
##$#  $ $  #.....#
#  #$ #     .....#
#  #     $ ####  #
#  #.##$# ##  ##$#
# $#.$ $   #     #
# $ .$ @####$$   #
####.$ $.... $ $ #
   ###  ##########
     ####
; Hard

     ############
     #          ##
     #           #
####### #######  #
#@     $$ #   #..#
#   $ $$  #$   ..#
#  $ $$ $ #   #  #
##$ $$ $  #$#### ##
#  $$ $   #...#.. #
#  $ $ $  #...... #
#       #  ...... #
###################
; Hard

              ####
###############  #
#  .*...#@$ $    #
#  #....#$$ $  $ #
#  #....#  $  $  #
#  #...*$ $$$ $$ #
# $#....#     $. #
#  #.*..# $ $  * #
#  .$ $ ####### ##
#  #    $ $ $ $ #
########        #
       ##########
; Hard

  ##############
  #     #      #
  # $$   ***#  #
  #  $  #*.* $ #
  # #.# #...#  #
  # #*  # $ #$ #
  # #.#$#  $#  #
  #     #   #$ #
#####$$######  #
#   #..*..$ $$ #
# $  .....#   @#
################
; Hard

     ##############
     #  ....*@#   #
     #  #..*.$  $ #
     # $#...* #####
####### #....$#   #
#     # ####$   $ #
#  $ $# ...  ### ##
# $ $ # .*  $     #
#  $ $##.*#########
# $ $$   $  $  $  #
#       #         #
###################
; Hard
`

WALL = '#'
TARGET = '.'
BOX = '$'
PLAYER = "@"

EASY = "Easy"
MEDIUM = "Medium"
HARD = "Hard"


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
  }
}

function load_level_from_string(level_string)
{
  lines = level_string.split('\n')
  level = new Level()
  level.width = lines[0].length,
  level.height = lines.length - 1,
  level.difficulty = lines[lines.length - 1].substr(2)
  
  for (let y = 0; y < lines.length - 1; y++)
    for (let x = 0; x < lines[y].length; x++)
    {
      level.width = Math.max(level.width, lines[y].length)
      let c = lines[y][x];
      if (c == PLAYER)
        level.player = [x, y]
      else if (c == WALL)
        level.walls.push([x, y])
      else if (c == BOX)
        level.boxes.push([x, y])
      else if (c == TARGET)
        level.targets.push([x, y])
    }
  
  remove_unreachable(level)
  return level
}

function array_equals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

function contains_array(array, value)
{
  return array.some(x => array_equals(x, value))
}

function remove_unreachable(level)
{
  let visited = []
  let q = []
  start = level.player
  q.push(start) 
  visited.push(level) 
  while (q.length > 0)
  {
    let current = q.shift()
    for (let dx = -1; dx < 2; dx++)
      for (let dy = -1; dy < 2; dy++)
      {
        if (dx * dx == dy * dy) continue;
        let next = [current[0] + dx, current[1] + dy]
        if (contains_array(visited, next)) continue
        if (contains_array(level.walls, next)) continue
        q.push(next)
        visited.push(next)
      }
  }
  for (let x = 0; x < level.width; x++)
    for (let y = 0; y < level.height; y++)
    {
      if (!contains_array(visited, [x, y]))
        level.walls.push([x, y])
    }
}

function load_levels_from_string(levels_string)
{
  lines = levels_string.split('\n')
  current = ""
  levels = []
  let current_index = 0
  for (let line of lines)
  {
    if (line == '') continue
    current += line
    if (line[0] ==';')
    {
      let level = load_level_from_string(current)
      level.index = current_index
      levels.push(level)
      current_index += 1
      current = ""
    }
    else current += "\n"
  }
  return levels
}
