import os

dir_name_css = "build/static/css/"
dir_name_js = "build/static/js/"
css = os.listdir(dir_name_css)
js = os.listdir(dir_name_js)

for item in css:
    if item.endswith(".map"):
        os.remove(os.path.join(dir_name_css, item))

for item in js:
    if item.endswith(".map"):
        os.remove(os.path.join(dir_name_js, item))

for item in js:
    if item.endswith(".txt"):
        os.remove(os.path.join(dir_name_js, item))