import { Astal, Gtk, Gdk, App, hook, Widget } from "astal/gtk4"
import Notifd from "gi://AstalNotifd"
import Notification from "./notification"
import { timeout, Variable } from "astal"
import { bind, Subscribable } from "astal/binding"
import { PopupWindow } from "../PopupWindow"

export const NotificationPopup = () => {
    const { TOP, RIGHT } = Astal.WindowAnchor
    const notifd = Notifd.get_default()

    return (
        <PopupWindow
            name={"notification-popup"}
            cssClasses={["NotificationPopups"]}
            application={App}
            animation="slide right"
            anchor={TOP | RIGHT}
            setup={(self) => {
                const notificationQueue: number[] = []
                let isProcessing = false

                function processQueue() {
                    if (isProcessing || notificationQueue.length === 0) return;
                    isProcessing = true;
                    const id = notificationQueue.shift()

                    self.set_child(
                        <box vertical>
                            {Notification({notification: notifd.get_notification(id!)})}
                            <box vexpand/>
                        </box>
                    )
                    self.visible = true;

                    timeout(5000, () => {
                        self.set_child(null);
                        self.visible = false;
                        isProcessing = false
                        timeout(300, () => {
                            processQueue();
                        })
                    })
                }

                hook(self, notifd, "notified", (_, id: number) => {
                    if (notifd.dont_disturb && 
                        notifd.get_notification(id).urgency != Notifd.Urgency.CRITICAL
                    ) {return}

                    notificationQueue.push(id)
                    processQueue()
                })

                hook(self, notifd, "resolved", (_) => {
                    self.visible = false
                    isProcessing = false
                    timeout(300, () => {
                        processQueue()
                    })
                })
            }}>
        </PopupWindow>
    )
}
