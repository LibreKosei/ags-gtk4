import { bind } from "astal"
import { Gtk } from "astal/gtk4"
import Hyprland from "gi://AstalHyprland"
import Pango from "gi://Pango?version=1.0"

const isIcon = (icon: string) => {
    const it = Gtk.IconTheme.new()
    return it.has_icon(icon)
}

export const Client = () => {
    const hyprland = Hyprland.get_default()
    const focused = bind(hyprland, "focused_client")

    return <box
        cssName="focused_client"
        halign={Gtk.Align.START}
        visible={focused.as(Boolean)}>
        {focused.as(client => (
            client && <box spacing={5}>
            {isIcon(client.initialClass) && <image iconName={client.initialClass} />}
                <label
                  maxWidthChars={30}
                  ellipsize={Pango.EllipsizeMode.END}
                  label={bind(client, "title").as(String)} 
                />
            </box>
        ))}
    </box>
}
