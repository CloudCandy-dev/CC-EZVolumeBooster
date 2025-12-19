import os
import glob
import math
import configparser

config = configparser.ConfigParser()
config.read('./config.ini')

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


# 変数初期化
# 音量レベル倍率
volume_level     = config['setting']['volume_level']
converted_volume = str(convert_magnification_2_decibel(volume_level))
# 変換後フォーマット
after_format     = config['setting']['after_format']
# 加工前フォルダ
before_path      = config['setting']['before_path']
# 加工後フォルダ
after_path       = config['setting']['after_path']


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
