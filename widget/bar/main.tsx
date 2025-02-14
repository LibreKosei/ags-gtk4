import { Audio } from "./modules/audio";
import { Bat } from "./modules/battery";
import { WifiIndicator } from "./modules/network";
import { WS } from "./modules/workspace";
import { App, Astal, Gtk } from "astal/gtk4";
import { Datemenu } from "./modules/datemenu";
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
            <Client halign={Gtk.Align.START}/>
            <box spacing={10} halign={Gtk.Align.CENTER} >
                <WS />
                <Datemenu />
                <box spacing={5}>
                    <box cssName="applet">
                    <Audio />
                    <WifiIndicator />
                    <Bat />
                    </box>
                </box>
            </box>
        </centerbox>
    </window>
}
