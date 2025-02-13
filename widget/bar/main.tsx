import { Audio } from "./modules/audio";
import { Bat } from "./modules/battery";
import { WifiIndicator } from "./modules/network";
import { WS } from "./modules/workspace";
import { App, Astal, Gtk } from "astal/gtk4";
import { Datemenu } from "./modules/datemenu";

export const Bar = () => {
    const { TOP } = Astal.WindowAnchor

    return <window
        visible
        cssClasses={["Bar"]}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={ TOP }
        application={App} 
    >
        <box spacing={30} hexpand widthRequest={800}>
            <centerbox hexpand halign={Gtk.Align.FILL}>
            <WS />
            <Datemenu />
            <box halign={Gtk.Align.END} spacing={5}>
                <box cssName="applet">
                <Audio />
                <WifiIndicator />
                <Bat />
                </box>
            </box>
            </centerbox>
        </box>
    </window>
}
