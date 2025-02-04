import { Astal, Gtk, Gdk, App, hook, Widget } from "astal/gtk4"
import Notifd from "gi://AstalNotifd"
import Notification from "./notification"
import { timeout, Variable } from "astal"
import { bind, Subscribable } from "astal/binding"

export class NotificationMap implements Subscribable {
    #map: Map<number, Gtk.Widget> = new Map()
    #var: Variable<Array<Gtk.Widget>> = Variable([])

    constructor() {
        const notifd = Notifd.get_default()

        notifd.connect("notified", (_, id) => {
            this.#map.set(id, Notification({
                onHoverLeave: (self) => {
                    self.emit("destroy")
                },
                setup: (self) => {
                    self.connect("destroy", () => {
                        this.#map.delete(id)
                    })
                },
                notification: notifd.get_notification(id)
            })
            )
            this.append()
        })

        notifd.connect("resolved", (_, id) => {
            if (!this.#map.has(id)) return;

            this.#map.delete(id)
            this.append()
        })
    }

    append() {
        this.#var.set([...this.#map.values()].reverse())
    }

    subscribe(callback: (value: unknown) => void): () => void {
        return this.#var.subscribe(callback)
    }
    
    get() {
        return this.#var.get()
    }
}

export default function NotificationPopups() {
    const { TOP, RIGHT } = Astal.WindowAnchor
    const notifs = new NotificationMap();

    return <window
        cssClasses={["NotificationPopups"]}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | RIGHT}
    >
        <box vertical noImplicitDestroy>
            {bind(notifs)}
        </box>
    </window>
}
