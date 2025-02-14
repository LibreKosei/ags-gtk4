import { bind, Variable } from "astal";
import { Calendar, Scrollable } from "../../../util/astalified";
import Notification from "../../notification/notification";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { MaterialSymbol } from "../../../util/Material";
import { Gtk } from "astal/gtk4";

const time = Variable("").poll(1000, `date "+%H:%M"`)

export const Datemenu = () => {
    const notifd = AstalNotifd.get_default() 

    return (
        <menubutton>
            <box cssName="applet">
                <MaterialSymbol
                    icon={bind(notifd, "notifications").as(notifs => notifs.length === 0 ? "notifications" : "notifications_active")}
                />
                <Gtk.Separator orientation={Gtk.Orientation.VERTICAL} visible />
                <label label={time()} />
            </box>
            <popover>
                <box>
                    <Scrollable visible widthRequest={350}>
                        <box vertical hexpand vexpand>
                            <centerbox hexpand>
                                <label label="notifications" halign={Gtk.Align.START} />
                                <box visible={false} />
                                <button
                                    onClicked={() => notifd.notifications.map(notif => notif.dismiss())}
                                    halign={Gtk.Align.END}
                                >
                                  <box>
                                      <label label="clear" />
                                      <MaterialSymbol icon="delete" />
                                  </box>
                                </button>
                            </centerbox>
                            {bind(notifd, "notifications").as(notifs => notifs.map(n => Notification({notification: n})))}
                            <label label="0 Notifications" visible={bind(notifd, "notifications").as(notifs => notifs.length === 0)}/>
                        </box>
                    </Scrollable>
                    <Calendar widthRequest={300} heightRequest={250}/>
                </box>
            </popover>
        </menubutton>
    )
}
