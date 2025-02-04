import { App, Astal, Gdk } from "astal/gtk4";
import { WindowProps } from "astal/gtk4/widget";

type PopupWindowProps = {
    animation?: string,
    visible?: boolean
    name: string 
} & WindowProps

export const PopupWindow = ({
  visible,
  name,
  ...props
}: PopupWindowProps) => {
    return <window
      visible={visible ?? false}
      name={name}
      namespace={name}
      application={App}
      layer={Astal.Layer.TOP}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressed={(self, keyval) => {
          if (keyval === Gdk.KEY_Escape) {
              self.hide()
          }
      }}
      {...props}
    >

    </window>
}
