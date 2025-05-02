import { exec, execAsync, GLib, monitorFile, readFileAsync, timeout, writeFile, writeFileAsync } from "astal"


function JSONStringify(format: string, json: JSON) {
    let result = ""

    for (let key in json) {
        let value = json[key]
        result += format.replace("{{key}}", key).replace("{{value}}", value) + "\n"
    }

    return result
}

export function setTheme() {
    readFileAsync("./style/colors.json")
        .then(colors => {
            const themeJSON = JSON.parse(colors)
            const themeMode = "dark"
            const theme = themeJSON["colors"][themeMode]
            
            setScssVars(theme)
        }
    )
}

function setScssVars(json: JSON) {
    writeFileAsync(
        "./style/colors.scss",
        JSONStringify("${{key}}: {{value}};", json)
    )
}

async function genColors(path: string) {
    return execAsync(`matugen image ${path} --json hex`).then(out => {
        writeFileAsync(
            "./style/colors.json",
            JSON.stringify(JSON.parse(out), null, 2)
        )
    })
}

export function monitorWallpaper() {
    const swwwPath = `${GLib.get_user_cache_dir()}/swww/eDP-1`
    monitorFile(
        swwwPath,
        (file, event) => {
            timeout(350, () => {
                execAsync(`cat ${swwwPath}`).then(file => {
                    genColors(file).then(() => {
                        timeout(250, setTheme)
                    })
                })
            })
        }
    )
}
