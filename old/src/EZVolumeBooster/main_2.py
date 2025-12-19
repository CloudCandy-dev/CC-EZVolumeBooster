import os, glob, math, sys, time
import flet as ft
from lib.loader import lang_load, get_text
from lib.config_lib import cf_change, cf_load

# 読み込み
lang_load()
config_data = cf_load()

# =================================================================
# = 倍率デシベル変換関数
# =================================================================
def convert_magnification_2_decibel(magnification):
    decibel = 20 * math.log10(float(magnification))
    return decibel

# =================================================================
# = ffmpeg実行
# =================================================================
def execute_ffmpeg(before_file_path, after_file_path, volume):
    cmd = "ffmpeg -i " + '"' + before_file_path + '" -filter:a "volume=' + volume + 'dB" "' + after_file_path + '"'
    os.system( cmd )

#====================
# メイン
#====================
def main(page: ft.Page):


    # 変数初期化
    # 音量レベル倍率
    volume_level     = config_data.get("volume_level")
    converted_volume = str(convert_magnification_2_decibel(volume_level))
    # 変換後フォーマット
    after_format     = config_data.get("after_format")
    # 加工前フォルダ
    before_path      = config_data.get("before_path")
    # 加工後フォルダ
    after_path       = config_data.get("after_path")

    # 加工対象ファイル取得
    before_process_folder_path = os.path.dirname(__file__) + before_path
    before_process_file_list = glob.glob( before_process_folder_path + "*.*" )

    # 対象ファイルリストでループ
    for before_process_file in before_process_file_list:
        #tempフォルダのパスを取得
        after_process_file = os.path.dirname(__file__) + after_path + os.path.splitext(os.path.basename(before_process_file))[0] + after_format

        if os.path.exists( after_process_file ):
            # すでに同じファイル名が存在する
            print( "exist:" + after_process_file )
        else:
            # 加工実行
            print( "convert:" + after_process_file )
            execute_ffmpeg(before_process_file, after_process_file, converted_volume)


    # イベントハンドラ
    # Click - Menu>File>Exit
    def handle_menu_quit_click(e):
        page.window.close()
    # Click - Menu>Info>help
    def handle_menu_help_click(e):
        page.open(dlg_help)
        page.update()
    # Click - Menu>Info>version
    def handle_menu_version_click(e):
        page.open(dlg_version)
        page.update()
    # Click - Menu>Info>license
    def handle_menu_license_click(e):
        page.open(dlg_license)
        page.update()
    # Click - Menu>Config>language
    def handle_menu_language_click(lang_code):
        cf_change("language", lang_code)
        page.open(dlg_conf_change)
        page.update()
    # Click - Menu>Config>theme
    def handle_menu_theme_click(mode):
        page.theme_mode = ft.ThemeMode(mode)
        page.update()


    #ダイアログの設定
    # Dialogs - help
    dlg_help = ft.AlertDialog(
        title=ft.Text(get_text("option_info_help_detail", github_url=get_text("option_info_help_detail_url"))),
    )
    # Dialogs - version
    dlg_version = ft.AlertDialog(
        title=ft.Text(get_text("option_info_version_detail", version=get_text("version"))),
    )
    # Dialogs - license
    dlg_license = ft.AlertDialog(
        title=ft.Text(get_text("option_info_license_detail")),
    )
    # Dialogs - config_change
    dlg_conf_change = ft.AlertDialog(
        title=ft.Text(get_text("option_config_change")),
    )


    # コンテンツの設定
    # Title
    appbar_text_ref = ft.Ref[ft.Text]()
    page.appbar = ft.AppBar(
        title=ft.Text(get_text("title"), ref=appbar_text_ref),
        center_title=True,
        bgcolor=ft.Colors.LIGHT_BLUE_ACCENT_700,
    )
    # Menu
    menubar = ft.MenuBar(
        expand=True,
        style=ft.MenuStyle(
            alignment=ft.alignment.top_left,
            bgcolor=ft.Colors.LIGHT_BLUE_ACCENT_400,
            mouse_cursor={
                ft.ControlState.HOVERED: ft.MouseCursor.WAIT,
                ft.ControlState.DEFAULT: ft.MouseCursor.ZOOM_OUT,
            },
        ),
        controls=[
            # Menu>File
            ft.SubmenuButton(
                content=ft.Text(get_text("option_file")),
                controls=[
                    # Menu>File>Exit
                    ft.MenuItemButton(
                        content=ft.Text(get_text("option_file_exit")),
                        leading=ft.Icon(ft.Icons.CLOSE),
                        style=ft.ButtonStyle(
                            bgcolor={ft.ControlState.HOVERED: ft.Colors.LIGHT_BLUE_ACCENT_200}
                        ),
                        on_click=handle_menu_quit_click,
                    ),
                ],
            ),
            ft.SubmenuButton(
                # Menu>Info
                content=ft.Text(get_text("option_info")),
                controls=[
                    # Menu>Info>help
                    ft.MenuItemButton(
                        content=ft.Text(get_text("option_info_help")),
                        leading=ft.Icon(ft.Icons.HELP),
                        style=ft.ButtonStyle(
                            bgcolor={ft.ControlState.HOVERED: ft.Colors.LIGHT_BLUE_ACCENT_200}
                        ),
                        on_click=handle_menu_help_click,
                    ),
                    # Menu>Info>version
                    ft.MenuItemButton(
                        content=ft.Text(get_text("option_info_version")),
                        leading=ft.Icon(ft.Icons.PERM_DEVICE_INFO),
                        style=ft.ButtonStyle(
                            bgcolor={ft.ControlState.HOVERED: ft.Colors.LIGHT_BLUE_ACCENT_200}
                        ),
                        on_click=handle_menu_version_click,
                    ),
                    # Menu>Info>license
                    ft.MenuItemButton(
                        content=ft.Text(get_text("option_info_license")),
                        leading=ft.Icon(ft.Icons.INFO),
                        style=ft.ButtonStyle(
                            bgcolor={ft.ControlState.HOVERED: ft.Colors.LIGHT_BLUE_ACCENT_200}
                        ),
                        on_click=handle_menu_license_click,
                    ),
                ],
            ),
            # Menu>Config
            ft.SubmenuButton(
                content=ft.Text(get_text("option_config")),
                controls=[
                    # Menu>Config>language
                    ft.SubmenuButton(
                        content=ft.Text(get_text("option_config_language")),
                        leading=ft.Icon(ft.Icons.LANGUAGE),
                        controls=[
                            # Menu>Config>language>ja
                            ft.MenuItemButton(
                                content=ft.Text(get_text("option_config_language_ja")),
                                close_on_click=False,
                                style=ft.ButtonStyle(
                                    bgcolor={
                                        ft.ControlState.HOVERED: ft.Colors.LIGHT_BLUE_ACCENT_200
                                    }
                                ),
                                on_click=lambda e: handle_menu_language_click("ja"),
                            ),
                            # Menu>Config>language>en
                            ft.MenuItemButton(
                                content=ft.Text(get_text("option_config_language_en")),
                                close_on_click=False,
                                style=ft.ButtonStyle(
                                    bgcolor={
                                        ft.ControlState.HOVERED: ft.Colors.LIGHT_BLUE_ACCENT_200
                                    }
                                ),
                                on_click=lambda e: handle_menu_language_click("en"),
                            ),
                        ],
                    ),
                    # Menu>Config>theme
                    ft.SubmenuButton(
                        content=ft.Text(get_text("option_config_theme")),
                        leading=ft.Icon(ft.Icons.FORMAT_PAINT),
                        controls=[
                            # Menu>Config>theme>light
                            ft.MenuItemButton(
                                content=ft.Text(get_text("option_config_theme_light")),
                                leading=ft.Icon(ft.Icons.LIGHT_MODE),
                                close_on_click=False,
                                style=ft.ButtonStyle(
                                    bgcolor={
                                        ft.ControlState.HOVERED: ft.Colors.LIGHT_BLUE_ACCENT_200
                                    }
                                ),
                                on_click=lambda e: handle_menu_theme_click("light"),
                            ),
                            # Menu>Config>theme>dark
                            ft.MenuItemButton(
                                content=ft.Text(get_text("option_config_theme_dark")),
                                leading=ft.Icon(ft.Icons.DARK_MODE),
                                close_on_click=False,
                                style=ft.ButtonStyle(
                                    bgcolor={
                                        ft.ControlState.HOVERED: ft.Colors.LIGHT_BLUE_ACCENT_200
                                    }
                                ),
                                on_click=lambda e: handle_menu_theme_click("dark"),
                            ),
                            # Menu>Config>theme>system
                            ft.MenuItemButton(
                                content=ft.Text(get_text("option_config_theme_system")),
                                leading=ft.Icon(ft.Icons.LAPTOP),
                                close_on_click=False,
                                style=ft.ButtonStyle(
                                    bgcolor={
                                        ft.ControlState.HOVERED: ft.Colors.LIGHT_BLUE_ACCENT_200
                                    }
                                ),
                                on_click=lambda e: handle_menu_theme_click("system"),
                            ),
                        ],
                    )
                ],
            ),
        ],
    )

    page.add(ft.Row([menubar]))


if __name__ == "__main__":
    ft.app(main)
