import { Gtk } from "astal/gtk4"
import { Calendar } from "../../util/astalified"
import { time } from "../bar/modules/datemenu"

export const DateMenu = () => {
    return <box vertical vexpand hexpand={false} cssName="datemenu">
        <label label={time()} hexpand halign={Gtk.Align.CENTER}/>
        <Calendar 
            heightRequest={350} 
            widthRequest={350} 
        />
    </box>
}
