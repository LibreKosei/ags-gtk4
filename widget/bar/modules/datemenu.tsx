import { bind, Variable } from "astal";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { MaterialSymbol } from "../../../util/Material";
import { App } from "astal/gtk4";
import { MENU_WINDOW } from "../../menu/main";

export const time = Variable("").poll(1000, `date "+%H:%M"`)
const notifd = AstalNotifd.get_default()

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
