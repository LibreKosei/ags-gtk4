import { Astal } from "astal/gtk4";
import { DateMenu } from "./Calendar"
import { PopupWindow } from "../PopupWindow"
import { NotificationColumn } from "./notificationColumn"

export const MENU_WINDOW = "menu";

export const Menu = () => {
    return <PopupWindow
        name="menu"
        animation="slide down"
        anchor={Astal.WindowAnchor.TOP}
    >
        <box>
            <NotificationColumn />
            <DateMenu />
        </box>
    </PopupWindow>
}
