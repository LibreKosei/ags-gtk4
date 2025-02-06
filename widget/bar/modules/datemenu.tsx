import { Variable } from "astal";
import { Calendar } from "../../../util/astalified";

const time = Variable("").poll(1000, `date "+%H:%M"`)

export const Datemenu = () => {
    return (
        <menubutton>
            <label label={time()} />
            <popover>
                <Calendar widthRequest={300} heightRequest={250}/>
            </popover>
        </menubutton>
    )
}
