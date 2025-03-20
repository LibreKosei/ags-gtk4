import { Audio } from "./modules/audio";
import { BatteryBar } from "./modules/battery";
import { WifiIndicator } from "./modules/network";
import { Workspaces } from "./modules/workspace";
import { App, Astal, Gtk } from "astal/gtk4";
import { DateWidget } from "./modules/datemenu";
import { Client } from "./modules/client";

export const Bar = () => {
    const { TOP, RIGHT, LEFT } = Astal.WindowAnchor

    return <window
        visible
        cssClasses={["Bar"]}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={ TOP | RIGHT | LEFT }
        application={App} 
    >
        <centerbox hexpand>
            <box spacing={10}>
                <Workspaces />
                <Client halign={Gtk.Align.START}/>
            </box>
            <box spacing={10} halign={Gtk.Align.CENTER} >
                <DateWidget />
            </box>
            <box spacing={5} cssName="end">
                <Audio />
                <WifiIndicator />
                <BatteryBar />
            </box>
        </centerbox>
    </window>
}
