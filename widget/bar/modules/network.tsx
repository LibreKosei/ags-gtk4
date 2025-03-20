import { bind, Variable } from "astal";
import { MaterialSymbol } from "../../../util/Material";
import Network from "gi://AstalNetwork";
import { Gtk, hook } from "astal/gtk4";

const material_symbols = {
  "network-wireless-signal-excellent-symbolic": "signal_wifi_4_bar",
  "network-wireless-signal-good-symbolic": "network_wifi_3_bar",
  "network-wireless-signal-ok-symbolic": "network_wifi_2_bar",
  "network-wireless-signal-weak-symbolic": "network_wifi_1_bar",
  "network-wireless-signal-none-symbolic": "signal_wifi_0_bar",
};

export const WifiIndicator = () => {
  const wifi = Network.get_default().wifi;
  const reveal = Variable(false)

  return  <box 
    onHoverLeave={() => reveal.set(false)} 
    marginStart={5}
  > 
          <MaterialSymbol 
              icon={material_symbols[wifi.icon_name]}
              setup={self => {
                  hook(self, wifi, "notify", () => {
                      if (wifi.enabled) {
                          self.label = material_symbols[wifi.icon_name]
                          self.tooltipText = wifi.ssid || "Unknown"
                      } else {
                          self.label = "signal_wifi_off"
                          self.tooltipText = "Disabled"
                      }
                  })
              }}
              onHoverEnter={() => reveal.set(true)}
          />
      <revealer
        revealChild={reveal()}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
      >
          <label label={bind(wifi, "ssid").as(String)} 
            onHoverLeave={() => reveal.set(false)}
            marginEnd={0}
          />
      </revealer>
  </box>
}
