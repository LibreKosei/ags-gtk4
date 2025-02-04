import Battery from "gi://AstalBattery";
import { MaterialSymbol } from "../../../util/Material";
import { bind } from "astal";
import { hook } from "astal/gtk4";

const battery_icons = {
    charging: {
        100: "battery_charging_full",
        90: "battery_charging_90",
        80: "battery_charging_80",
        70: "battery_charging_80",
        60: "battery_charging_60",
        50: "battery_charging_50",
        40: "battery_charging_30",
        30: "battery_charging_30",
        20: "battery_charging_20",
        10: "battery_charging_20",
        0: "battery_charging_20"
    },
    100: "battery_full",
    90: "battery_6_bar",
    80: "battery_5_bar",
    70: "battery_5_bar",
    60: "battery_4_bar",
    50: "battery_3_bar",
    40: "battery_2_bar",
    30: "battery_2_bar",
    20: "battery_1_bar",
    10: "battery_1_bar",
    0: "battery_alert"
}

function matchBatL(level, charging) {
  const array = !charging ? battery_icons : battery_icons.charging;
  const levels = Object.keys(array)
    .map(Number)
    .sort((a, b) => b - a);
  for (let i = 0; i < levels.length; i++) {
    if (level >= levels[i]) {
      return array[levels[i]]
    }
  }
  return array[levels[levels.length - 1]];
}

export const Bat = () => {
    const battery = Battery.get_default()

    return <box
        cssName="applet"
        tooltipText={bind(battery, "percentage").as(p => `Battery ${Math.floor(p * 100)}%`)}
    >
        <MaterialSymbol setup={self => {
            hook(self, battery, "notify", () => {
                self.label = matchBatL(battery.percentage * 100, battery.charging)
            })
        }} 
            icon={matchBatL(battery.percentage * 100, battery.charging)}
        />
        <label label={bind(battery, "percentage").as(p => `${Math.floor(p * 100)}%`)} />
    </box>
}
