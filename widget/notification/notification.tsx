import { bind, GLib } from "astal"
import { Gtk } from "astal/gtk4"
import Notifd from "gi://AstalNotifd"
import Pango from "gi://Pango?version=1.0"
import { Scrollable } from "../../util/astalified"

const isIcon = (icon: string) => {
    if (icon === null) return false
    const it = Gtk.IconTheme.new()
    return it.has_icon(icon)
}

const fileExists = (path: string) => {
    if (path === null) return false
    return GLib.file_test(path, GLib.FileTest.IS_REGULAR)
}
const time = (time: number, format = "%H:%M") => GLib.DateTime
    .new_from_unix_local(time)
    .format(format)!

const urgency = (n: Notifd.Notification) => {
    const { LOW, NORMAL, CRITICAL } = Notifd.Urgency
    // match operator when?
    switch (n.urgency) {
        case LOW: return "low"
        case CRITICAL: return "critical"
        case NORMAL:
        default: return "normal"
    }
}

type Props = {
    setup?(self: Gtk.Box): void
    onHoverLeave?(self: Gtk.Box): void
    notification: Notifd.Notification
}

const NotificationIcon = ({desktopEntry, appIcon, image}: Notifd.Notification) => {

    if (image) {
        return <image
            vexpand
            valign={Gtk.Align.START}
            file={image}
        />
    }
    if (fileExists(appIcon))
        return <image
            file={appIcon}
            vexpand
            valign={Gtk.Align.START}
        />
    else if (isIcon(appIcon)) 
        return <image
            icon_name={appIcon}
            vexpand
            valign={Gtk.Align.START}
        />

    else if (isIcon(desktopEntry))
        return <image
            icon_name={desktopEntry}
            vexpand
            valign={Gtk.Align.START}
        />
    else if (fileExists(desktopEntry))
        return <image
            file={desktopEntry}
            vexpand
            valign={Gtk.Align.START}
        />
    else return <image iconName={appIcon} vexpand valign={Gtk.Align.START} />
}
export default function Notification(props: Props) {
    const { notification: n, onHoverLeave, setup } = props
    const { START, CENTER, END } = Gtk.Align

    return <box
        cssClasses={[`Notification ${urgency(n)}`]}
        setup={setup}
        hexpand
        halign={CENTER}
        vexpand={false}
        cssName="Notification"
        widthRequest={250}
        onHoverLeave={onHoverLeave}>
        <box vertical>
            <box cssClasses={["header"]}>
                <label
                    cssClasses={["app-name"]}
                    halign={START}
                    maxWidthChars={15}
                    label={n.appName || "Unknown"}
                />
                <label
                    cssClasses={["time"]}
                    hexpand
                    halign={END}
                    label={time(n.time)}
                />
                <button onClicked={() => n.dismiss()}>
                    <image iconName="window-close-symbolic" />
                </button>
            </box>
            <Gtk.Separator visible />
            <box cssClasses={["content"]} vexpand>
                {NotificationIcon(n)}
                <box vertical vexpand>
                    <label
                        cssClasses={["summary"]}
                        maxWidthChars={30}
                        ellipsize={Pango.EllipsizeMode.END}
                        halign={START}
                        xalign={0}
                        label={n.summary}
                    />
                    {n.body && <Scrollable heightRequest={75} widthRequest={200}><label
                        cssClasses={["body"]}
                        wrap
                        useMarkup
                        vexpand
                        hexpand
                        valign={START}
                        halign={START}
                        xalign={0}
                        label={n.body}
                      /></Scrollable>}
                </box>
            </box>
            {n.get_actions().length > 0 && <box cssClasses={["actions"]}>
                {n.get_actions().map(({ label, id }) => (
                    <button
                        hexpand
                        onClicked={() => n.invoke(id)}>
                        <label label={label} halign={CENTER} hexpand />
                    </button>
                ))}
            </box>}
        </box>
    </box>
}
