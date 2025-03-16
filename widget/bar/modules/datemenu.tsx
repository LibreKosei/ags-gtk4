import { bind, Variable } from "astal";
import { Calendar, Scrollable } from "../../../util/astalified";
import {Notification} from "../../notification/notif";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { MaterialSymbol } from "../../../util/Material";
import { App, Gtk, hook } from "astal/gtk4";
import { MENU_WINDOW } from "../../menu/main";

export const time = Variable("").poll(1000, `date "+%H:%M"`)
const notifd = AstalNotifd.get_default()

type Props = {
    notification: AstalNotifd.Notification
}

const TRANSITION = 300

const Animated = ({notification}: Props) => {
    return <revealer
        revealChild={true}
        transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
        transitionDuration={TRANSITION}
        setup={self => {
            hook(self, notifd, "resolved", () => {
                self.revealChild = false
                self.unparent()
            })
        }}
    >
        <Notification notification={notification} />
    </revealer>
}

export const DateWidget = () => {
    return <button onClicked={() => App.toggle_window(MENU_WINDOW)} >
        <box cssName="applet">
            <MaterialSymbol
                icon={bind(notifd, "notifications").as(notifs => notifs.length === 0 ? "notifications" : "notifications_active")}
            />
            <label label={time()} />
        </box>
    </button>
} 

export const Datemenu = () => {
    const notifd = AstalNotifd.get_default() 

    return (
        <menubutton>
            <box cssName="applet">
                <MaterialSymbol
                    icon={bind(notifd, "notifications").as(notifs => notifs.length === 0 ? "notifications" : "notifications_active")}
                />
                <label label={time()} />
            </box>
            <popover>
                <box>
                    <box vertical vexpand widthRequest={350}>
                        <centerbox>
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
                        <Scrollable heightRequest={200}>
                            <box vertical spacing={5}>
                                {bind(notifd, "notifications").as(notifs =>
                                  notifs.sort((a, b) => b.time - a.time)
                                        .map(n => Animated({notification: n})
                                  ))
                                }
                            </box>
                        </Scrollable>
                        <label 
                            label="No notification" 
                            visible={bind(notifd, "notifications").as(notifs => notifs.length === 0)}
                            valign={Gtk.Align.CENTER}
                        />
                    </box>
                    <Calendar widthRequest={350} heightRequest={250}/>
                </box>
            </popover>
        </menubutton>
    )
}
