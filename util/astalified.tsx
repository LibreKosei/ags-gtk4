import { Astal, astalify, ConstructProps, Gtk, Widget } from "astal/gtk4";

type CalendarProps = ConstructProps<Gtk.Calendar, Gtk.Calendar.ConstructorProps>

export const Calendar = astalify<Gtk.Calendar, Gtk.Calendar.ConstructorProps>(Gtk.Calendar, {
    getChildren(self) { return [] },
    setChildren(self, children) {},
})

export const Scrollable = astalify(Gtk.ScrolledWindow)

export const ProgressBar = astalify(Gtk.ProgressBar)
