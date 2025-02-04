import { Variable } from "astal";
import { Speaker, Audio, Volume } from "./modules/audio";
import { Bat } from "./modules/battery";
import { Wifi, WifiIndicator } from "./modules/network";
import { WS } from "./modules/workspace";
import { App, Astal, Gtk } from "astal/gtk4";
import { Bluetooth } from "./modules/bluetooth";
import { Datemenu } from "./modules/datemenu";


const time = Variable("").poll(1000, `date "+%H:%M"`)

export const Bar = () => {
    const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor

    return <window
        visible
        cssClasses={["Bar"]}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={ TOP }
        application={App} 
    >
        <box spacing={30} hexpand widthRequest={1200}>
            <centerbox hexpand halign={Gtk.Align.FILL}>
            <WS />
            <Datemenu />
            <box halign={Gtk.Align.END} spacing={5}>
                <box cssName="applet">
                <Audio />
                <WifiIndicator />
                <Bat />
                </box>
                <Bluetooth />
            </box>
            </centerbox>
        </box>
    </window>
}
