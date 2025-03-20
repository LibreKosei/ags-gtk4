import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk4"
import { Variable } from "astal"
import { MaterialSymbol } from "../../util/Material"
import { PopupWindow } from "../PopupWindow"
import { Scrollable } from "../../util/astalified"

const MAX_ITEMS = 8

function hide() {
    App.get_window("launcher")!.hide()
}

function AppButton({ app }: { app: Apps.Application }) {
    return <button
        cssClasses={["AppButton"]}
        onClicked={() => { hide(); app.launch() }}>
        <box>
            <image iconName={app.iconName} />
            <box valign={Gtk.Align.CENTER} vertical>
                <label
                    cssClasses={["name"]}
                    maxWidthChars={35}
                    xalign={0}
                    label={app.name}
                />
                {app.description && <label
                    cssClasses={["description"]}
                    maxWidthChars={35}
                    wrap
                    xalign={0}
                    label={app.description}
                />}
            </box>
        </box>
    </button>
}

export default function Applauncher() {
    const { CENTER } = Gtk.Align
    let apps = new Apps.Apps()

    const text = Variable("")
    const list = text(text => apps.fuzzy_query(text))
    const onEnter = () => {
        apps.fuzzy_query(text.get())?.[0].launch()
        hide()
    }

    return <PopupWindow
        name="launcher"
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        layer={Astal.Layer.OVERLAY}
        application={App}
        defaultHeight={600}
        animation="slide down"
        onShow={() => {
            apps.reload()
            text.set("")
        }}
        onHide={() => {
            text.set("")
        }}
        onKeyPressed={(self, keyval) => {
            if (keyval == Gdk.KEY_Escape)
                self.hide()
                text.set("")
        }}>
            <box widthRequest={500} cssClasses={["Applauncher"]} vertical>
                <box valign={Gtk.Align.CENTER}>
                    <entry
                        placeholderText="Search"
                        text={text.get()}
                        onChanged={self => text.set(self.text)}
                        onActivate={onEnter}
                        hexpand={true}
                        setup={(self) => {
                            self.connect("map", () => {
                                self.grab_focus()
                                self.text = "" // This is needed to clear the entry, not sure how I can do this with its buffer
                            })
                        }}
                    />
                </box>
                <Scrollable heightRequest={500} hscrollbar-policy={Gtk.PolicyType.NEVER}>
                <box spacing={6} vertical>
                    {list.as(list => list.map(app => (
                        <AppButton app={app} />
                    )))}
                </box>
                </Scrollable>
                <box
                    halign={CENTER}
                    cssClasses={["not-found"]}
                    vertical
                    visible={list.as(l => l.length === 0)}>
                    <image iconName="system-search-symbolic" />
                    <label label="No match found" />
                </box>
            </box>
    </PopupWindow>
}
