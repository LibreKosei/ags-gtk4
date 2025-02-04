import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import { MaterialSymbol } from "../../../util/Material";
import { bind, Variable } from "astal";
import { Gtk, hook } from "astal/gtk4";
import { Subscribable } from "astal/binding";

export const BIndicator = () => {
    const bluetooth = AstalBluetooth.get_default()

    return (
    <menubutton
      visible={bind(bluetooth, "devices").as(devs => devs.some(dev => dev.get_connected()))}
    >
        <MaterialSymbol 
          icon="bluetooth"
          setup={(self) => {
              hook(self, bluetooth, "device-added", () => {
                  const devices = bluetooth.devices
                  if (devices.some(dev => dev.connected) === true) {
                      self.label = "bluetooth_connected"
                  }
              })
              hook(self, bluetooth, "device-removed", () => {
                  const devices = bluetooth.devices
                  if (!devices.some(dev => dev.connected)) {
                      self.label = "bluetooth"
                  }
              })
          }}
        />
        <popover>
            <box hexpand vertical>
                <label label="Connected: " halign={Gtk.Align.START} />

            </box>
        </popover>
    </menubutton>)
}

export const Bluetooth = () => {
  const bluetooth = AstalBluetooth.get_default()

  return (
  <menubutton cssName="applet">
      <MaterialSymbol
        icon={bind(bluetooth, "devices").as(devs => devs.some(dev => dev.connected == true) ? "bluetooth_connected" : "bluetooth")}
      />
      <popover>
          <box hexpand vertical>
              <label label="Connected:" halign={Gtk.Align.START}/>
              <box noImplicitDestroy vertical>
                  {bind(bluetooth, "devices").as(devs => devs.filter(dev => dev.connected == true)
                                                             .map(Device))}
              </box>
              <label label="Paired:" halign={Gtk.Align.START}/>
              <box noImplicitDestroy vertical>
                  {bind(bluetooth, "devices").as(devs => devs.filter(dev => dev.paired == true)
                                                             .map(Device))}
              </box>
          </box>
      </popover>
  </menubutton>
  )
}

function Device (device: AstalBluetooth.Device) {
    return (
      <box 
        spacing={5} 
        halign={Gtk.Align.START} 
        cssName="bluetooth-device"
        setup={self => {
          self.connect("notify::unparent", () => self.unparent())
        }}
      >
          <image iconName={device?.icon} icon_size={Gtk.IconSize.NORMAL} />
          <label label={device?.alias} maxWidthChars={20} />
      </box>
    )
}

class Devices implements Subscribable {
    private map: Map<string, Gtk.Widget> = new Map()
    private var: Variable<Array<Gtk.Widget>> = Variable([])

    private notify() {
        this.var.set([...this.map.values()])
    }

    private set(key: string, value: Gtk.Widget) {
        this.map.get(key)?.emit("notify::unparent")
        this.map.set(key, value)
        this.notify()
    }

    private delete(key: string) {
        this.map.get(key)?.emit("notify::unparent")
        this.map.delete(key)
        this.notify()
    }

    constructor(devices: AstalBluetooth.Device[]) {
        devices.map(device => {
            this.set(device.alias, Device(device))
        })
    }

    get(): unknown {
        return this.var.get()
    }

    subscribe(callback: (value: Array<Gtk.Widget>) => void) {
        return this.var.subscribe(callback)
    }
}
