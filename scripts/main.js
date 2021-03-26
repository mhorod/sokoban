link_menu_buttons()
check_cookies_accepted()
close_all_menus()
open_main_menu()

levels = load_levels_from_string(LEVELS)
levels_by_difficulty = split_levels_by_difficulty(levels)

game_state = load_game_state()
generate_random_level_menu(levels_by_difficulty, play_single_level)
generate_all_levels_menu(game_state, levels, play_game)
generate_level_editor_menu(game_state.user_levels)

