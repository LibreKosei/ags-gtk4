import Hyprland from "gi://AstalHyprland";
import { MaterialSymbol } from "../../../util/Material";
import { bind, execAsync } from "astal";
import { Gtk, hook } from "astal/gtk4";

const hypr = Hyprland.get_default()

function dispatch(ws: number) {
    execAsync(`hyprctl dispatch workspace ${ws}`);
}

function range(length: number, start: number = 1) {
    return Array.from({ length }, (_, i) => i + start)
}

type Props = {
    i: number
}

const Icon = ({i} : Props) => {
    return <MaterialSymbol
        setup={self => {
            hook(self, hypr, "notify", () => {
                if (hypr.focusedWorkspace.id === i) {
                    self.label = "radio_button_checked"
                } else {
                    self.label = "radio_button_unchecked"
                }
            })
        }}
        icon={bind(hypr, "focusedWorkspace").as(fws => `${fws.id === i ? "radio_button_checked" : "radio_button_unchecked"}`)}
    />
}

export const WS = () => {
    return <box
        cssName="applet"
        spacing={5}
        halign={Gtk.Align.START}  
    >
        {range(9).map( (i) => 
            <button onClicked={() => dispatch(i)} >
                <Icon i={i}/>
            </button>
        )}
    </box>
}
