import Hyprland from "gi://AstalHyprland";
import { execAsync } from "astal";
import { Gtk, hook } from "astal/gtk4";

const hypr = Hyprland.get_default()

function dispatch(ws: number) {
    execAsync(`hyprctl dispatch workspace ${ws}`);
}

function range(length: number, start: number = 1) {
    return Array.from({ length }, (_, i) => i + start)
}

export const Workspaces = () => {
    const hypr = Hyprland.get_default()

    return <box cssName="workspaces">
    {range(9).map(i => 
        <label
            valign={Gtk.Align.CENTER}
            cssName="ws"
            setup={self => {
                if (self.label === String(hypr.focusedWorkspace.id)) self.cssClasses = ["active"];
                hook(self, hypr, "notify", () => {
                    if (hypr.focusedWorkspace.id === i) {
                        self.cssClasses = ["active"]
                    } else if (hypr.get_workspace(i)?.clients.length > 0) {
                        self.cssClasses = ["occupied"]
                    } else {
                        self.cssClasses = [""]
                    }
                })
            }}
            label={i.toString()}
        />
    )}
    </box>
}
