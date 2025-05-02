import { bind, Variable } from "astal";
import { MaterialSymbol } from "../../../util/Material";
import Wp from "gi://AstalWp";
import { Gtk, hook } from "astal/gtk4";

export const Audio = () => {
    const speaker = Wp.get_default()?.audio.defaultSpeaker!
    const reveal = Variable(false)

    return (
    <box
        onHoverLeave={() => {
            if (reveal.get()) {
                reveal.set(false)
            }
        }}
        onScroll={(self, _, dy) => {
            if (dy < 0) {
                speaker.volume += 0.01
            } else {
                speaker.volume -= 0.01
            }
        }}
    >
        <button 
          onClicked={() => {
            speaker.mute = !speaker.get_mute()
          }}
          onHoverEnter={() => reveal.set(true)}
        >
            <MaterialSymbol setup={self => {
                hook(self, speaker, "notify", () => {
                    const vol = speaker.volume * 100;
                    const icon = [
                        [101, "sound_detection_loud_sound"],
                        [67, "volume_up"],
                        [34, "volume_down"],
                        [1, "volume_mute"],
                        [0, "volume_off"]
                    ].find( ([threshold]) => Number(threshold) <= vol)?.[1]
                    if (speaker.mute) {
                        self.label = "volume_off"
                    } else {
                        self.label = String(icon)
                    }
                })
            }} />
        </button>
        <revealer revealChild={reveal()} transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}>
            <label 
              label={bind(speaker, "volume").as(v => `${Math.floor(v * 100)}%`)}
              onHoverLeave={() => reveal.set(false)}   
            />
        </revealer>
    </box>
    )
}
