import { useOthers } from "@/liveblocks.config";
import CursorSVG from "@/public/assets/CursorSVG";

type Props = {
    color:string,
    x:number,
    y:number,
    message:string
};

const Cursor = ({color,x,y,message}:Props) => {
  const others = useOthers();
    return (
    <div className="pointer-events-none absolute top-0 left-0"
    style={{transform:`translateX(${x}px) translateY(${y}px)`}}
    >
        <CursorSVG color={color} />
      {/* if any user having a message show the message */}
      {
        message && (
          <div>
            <p>{message}</p>
          </div>
        )
      }
    </div>
  )
}

export default Cursor