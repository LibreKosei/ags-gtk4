import AstalNotifd from "gi://AstalNotifd";
import { Scrollable } from "../../util/astalified";
import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import Notification from "../notification/notification";

const notifd = AstalNotifd.get_default()

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

