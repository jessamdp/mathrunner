PROJECTROOT: str = ""
PROJECTNAME: str = "Mathrunner"
AUTHOR: str = "Jessa Montero Dela Peña"
LAUNCH: bool = False
PACKAGE: bool = False
DEBUG: bool = False # if False, JavaScript will be minified

import os
import subprocess
import zipfile


def list_all_files() -> list[str]:
    files: list[str] = []
    for root, dirs, filenames in os.walk(os.path.join(PROJECTROOT, "src")):
        for filename in filenames:
            files.append(os.path.join(root, filename).replace("\\", "/"))
    return files


def generate_js(no_music: bool = False) -> list[str]:
    content: list[str] = []
    scripts: list[str] = list_all_files()
    for script in scripts:
        if script.endswith(".js"):
            with open(script, mode="r", encoding="utf-8") as file:
                content.append(f"// {script}\n")
                for line in file:
                    if no_music:
                        if line.startswith("var audioFiles = "):
                            temp: str = line.replace("\"bgm\", ", "")
                            content.append(temp)
                            continue
                        elif "this.bgmSound" in line or "scene.bgmSound" in line:
                            continue
                    content.append(line)
    return content


def write_js(content: list[str], target: str = "build/bundle.js") -> None:
    if not os.path.exists(os.path.join(PROJECTROOT, "build")):
        os.mkdir(os.path.join(PROJECTROOT, "build"))
    with open(os.path.join(PROJECTROOT, target), mode="w", encoding="utf-8") as file:
        file.writelines(content)


def generate_html(no_music: bool = False) -> str:
    content: str = '<!DOCTYPE html>\n<html lang="en">\n\t<head>\n\t\t<meta charset="UTF-8">\n'
    content += '\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    content += '\t\t<meta name="author" content="' + AUTHOR + '">\n'
    content += '\t\t<title>' + PROJECTNAME + '</title>\n'
    content += '\t\t<link rel="stylesheet" href="css/style.css">\n'
    content += '\t\t<script type="text/javascript" src="lib/phaser.min.js"></script>\n'
    
    if DEBUG:
        scripts: list[str] = list_all_files()
        for script in scripts:
            if script.endswith(".js"):
                content += f'\t\t<script type="text/javascript" src="{script}"></script>\n'
    else:
        bundle: str = "dist/bundle.nomusic.js" if no_music else "dist/bundle.js"
        content += '\t\t<script type="text/javascript" src="' + bundle + '"></script>\n'

    content += '\t</head>\n\t<body>\t\n\t</body>\n</html>'
    return content


def write_html(content: str, target: str = "index.html") -> None:
    with open(os.path.join(PROJECTROOT, target), mode="w", encoding="utf-8") as file:
            file.writelines(content)


def zip_files(file_name: str, target_dir: str) -> str:
    if not os.path.exists(target_dir):
        os.mkdir(target_dir)
    # create a ZipFile object
    with zipfile.ZipFile(os.path.join(target_dir, file_name), "w", zipfile.ZIP_DEFLATED) as zip_file:
        # add index.html to the zip file
        zip_file.write(os.path.join(PROJECTROOT, "index.html"), arcname="index.html")
        # add all files in subfolders to the zip file
        sub_dirs: list[str] = ["assets", "css", "lib", "loc"]
        sub_dirs.append("src" if DEBUG else "dist")
        for sub_dir in sub_dirs:
            for root, dirs, filenames in os.walk(os.path.join(PROJECTROOT, sub_dir)):
                for filename in filenames:
                    zip_file.write(os.path.join(root, filename), arcname=os.path.join(root, filename).replace("\\", "/"))
    return os.path.join(target_dir, file_name)


if __name__ == "__main__":
    print(f"Building {PROJECTROOT}...")    
    write_html(generate_html())
    print("index.html generated.")
    write_html(generate_html(no_music=True), target="index.nomusic.html")
    print("index.nomusic.html generated.")

    if not DEBUG:
        write_js(generate_js())
        print("build/bundle.js generated.")
        write_js(generate_js(no_music=True), target="build/bundle.nomusic.js")
        print("build/bundle.nomusic.js generated.")

        print ("Running webpack for build/bundle.js...")
        subprocess.run(["npx", "webpack", "--config", "webpack.config.js"], cwd="./", shell=True)
        print("Webpack finished for build/bundle.js.")

        print ("Running webpack for build/bundle.nomusic.js...")
        subprocess.run(["npx", "webpack", "--config", "webpack.config.nomusic.js"], cwd="./", shell=True)
        print("Webpack finished for build/bundle.nomusic.js.")

    if LAUNCH:
        os.system("start http://localhost/" + PROJECTROOT )
        print("Project launched in browser.")
    
    if PACKAGE:
        output: str = zip_files(PROJECTNAME + ".zip", "build");
        print(f"Packaging finished: {output}")
    
    if os.path.exists(os.path.join(PROJECTROOT, "build/bundle.js")):
        os.remove(os.path.join(PROJECTROOT, "build/bundle.js"))
        print("build/bundle.js deleted.")

    if os.path.exists(os.path.join(PROJECTROOT, "build/bundle.nomusic.js")):
        os.remove(os.path.join(PROJECTROOT, "build/bundle.nomusic.js"))
        print("build/bundle.nomusic.js deleted.")

    if os.path.exists(os.path.join(PROJECTROOT, "build")) and len(os.listdir(os.path.join(PROJECTROOT, "build"))) == 0:
        os.rmdir(os.path.join(PROJECTROOT, "build"))
        print("build/ deleted.")

    print("All operations complete.")
