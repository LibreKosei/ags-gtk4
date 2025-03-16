import AstalNotifd from "gi://AstalNotifd";
import { Scrollable } from "../../util/astalified";
import { bind, timeout } from "astal";
import { Gtk, hook, Widget } from "astal/gtk4";
import Notification from "../notification/notification";

const notifd = AstalNotifd.get_default()

const Animated = (n: AstalNotifd.Notification) => Widget.Revealer({
    transition_duration: 300,
    transition_type: Gtk.RevealerTransitionType.SLIDE_DOWN,
    child: Notification({notification: n}),
    setup: self => timeout(300, () => {
        if (!self.parent) return
        self.revealChild = true
    })
})

const Notificationlist = () => {
    const map: Map<number, any> = new Map()
    const box = Widget.Box({
        vertical: true,
        children: notifd.notifications.map(n => {
            const w = Animated(n)
            map.set(n.id, w)
            return w
        }),
        visible: bind(notifd, "notifications").as(n => n.length > 0),
        setup: self => {
            hook(self, notifd, "resolved", remove)
            hook(self, notifd, "notified", (_, id: number) => {
                if (id !== undefined) {
                    if (map.has(id)) {
                        remove(null, id)
                    }
                    const n = notifd.get_notification(id)!
                    const w = Animated(n)
                    map.set(id, w)
                    box.children = [w, ...box.children]
                }
            })
        }
    })

    function remove(_: unknown, id: number) {
        const n = map.get(id)
        if (n) {
            n.revealChild = false
            timeout(300, () => {
                const parent = n.parent!
                parent.remove(n)
                map.delete(id)
            })
        }
    }
}

export const NotificationColumn = () => {
    return <box 
        vertical
        spacing={10}
        hexpand
        heightRequest={350} 
        widthRequest={400} 
    >
        <box cssName="notifcolumn-header">
            <label label="Notifications" xalign={0} hexpand/>
            <button
                onClicked={() => notifd.notifications.forEach(n => n.dismiss())}
                label="Clear all"
                valign={Gtk.Align.END}
            >
            </button>
        </box>

        <Scrollable 
          heightRequest={350} 
          widthRequest={400} 
          cssName="notifcolumn-scrollable"
          hscrollbar-policy={Gtk.PolicyType.NEVER}
          visible={bind(notifd, "notifications").as(n => n.length > 0)}
          hexpand={false}
        >
            <box vertical spacing={10} hexpand>
            {bind(notifd, "notifications").as(notifs => notifs
                                              .sort((a, b) => b.time - a.time)
                                              .map(n => Notification({notification: n})))}
            </box>
        </Scrollable>
        <label 
          label="No notification" 
          vexpand
          hexpand
          valign={Gtk.Align.CENTER} 
          visible={bind(notifd, "notifications").as(notifs => notifs.length === 0)}/>
    </box>
}

