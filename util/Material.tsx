import { Binding } from "astal";
import { Gtk } from "astal/gtk4";
import { LabelProps } from "astal/gtk4/widget";

type Props = {
    icon?: string | Binding<string>,
    size?: number,
} & LabelProps

export function MaterialSymbol({icon, size = 24, ...rest}: Props) {
    return <label
        label={icon}
        cssName="material"
        //css={`font-size: ${size}px;` + `font-family: "Material Symbols Outlined"`}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        {...rest}
    />
}
