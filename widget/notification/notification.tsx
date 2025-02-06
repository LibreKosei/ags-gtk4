import { GLib } from "astal"
import { Gtk } from "astal/gtk4"
import Notifd from "gi://AstalNotifd"
import { Scrollable } from "../../util/astalified"

const isIcon = (icon: string) => {
    const it = Gtk.IconTheme.new()
    return it.has_icon(icon)
}

const fileExists = (path: string) =>
    GLib.file_test(path, GLib.FileTest.EXISTS)

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

export default function Notification(props: Props) {
    const { notification: n, onHoverLeave, setup } = props
    const { START, CENTER, END } = Gtk.Align

    return <box
        cssClasses={[`Notification ${urgency(n)}`]}
        setup={setup}
        hexpand={false}
        cssName="Notification"
        widthRequest={250}
        onHoverLeave={onHoverLeave}>
        <box vertical>
            <box cssClasses={["header"]}>
                {(isIcon(n.appIcon) || n.desktopEntry) && <image
                    cssClasses={["app-icon"]}
                    visible={Boolean(n.appIcon || n.desktopEntry)}
                    iconName={n.appIcon || n.desktopEntry}
                />}
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
            <box cssClasses={["content"]}>
                {n.image && fileExists(n.image) && <image
                    valign={START}
                    cssClasses={["image"]}
                    file={n.image}
                />}
                {n.image && isIcon(n.image) && <box
                    vexpand={false}
                    hexpand={false}
                    valign={START}
                    cssClasses={["icon-image"]}>
                    <image iconName={n.image} hexpand vexpand halign={CENTER} valign={CENTER} />
                </box>}
                <box vertical>
                    <label
                        cssClasses={["summary"]}
                        halign={START}
                        xalign={0}
                        label={n.summary}
                    />
                    {n.body && <label
                        cssClasses={["body"]}
                        wrap
                        useMarkup
                        halign={START}
                        xalign={0}
                        label={n.body}
                        maxWidthChars={30}
                      />}
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
