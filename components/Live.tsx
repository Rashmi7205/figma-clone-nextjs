"use client";
import { useMyPresence, useOthers } from "@/liveblocks.config"
import LiveCursor from "./cursor/LiveCursor"
import { useCallback,useEffect,useState } from "react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, Reaction } from "@/types/types";

const Live = () => {


  const [cursorState, setCursorState] = useState({
    mode:CursorMode.Hidden,
  });

  const [reaction,setReaction] = useState<Reaction[]>([]);
 
  const others = useOthers();
  const [{cursor},updateMyPresence] = useMyPresence() as any;
  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();

    // if cursor is not in reaction selector mode, update the cursor position
    if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
      // get the cursor position in the canvas
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

      // broadcast the cursor position to other users
      updateMyPresence({
        cursor: {
          x,
          y,
        },
      });
    }
  }, []);


  const handlePointerLeave = useCallback((event:React.PointerEvent)=>{
    event.preventDefault();
    setCursorState({
      mode: CursorMode.Hidden,
    });
    updateMyPresence({cursor:null,message:null});
  },[]);
  const handlePointerDown = useCallback((event:React.PointerEvent)=>{
    event.preventDefault();
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientX - event.currentTarget.getBoundingClientRect().y;
    updateMyPresence({cursor:{x,y}});
  },[]);
  
  // Track the key events for the chat box opening and closing
  useEffect(() => {
    function onKeyUp(e : KeyboardEvent) {
      if (e.key === "/") {
        setCursorState({ mode: CursorMode.Chat, previousMessage: null, message: "" });
      } else if (e.key === "Escape") {
        console.log("Escape");
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        // Handle other key events
      }
    }

    function onKeyDown(e:KeyboardEvent) {
      if (e.key === "/") {
        e.preventDefault();
      }
      else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [updateMyPresence]);
  
  
  return (
  
    <div
    onPointerMove={handlePointerMove}
    onPointerDown={handlePointerDown}
    onPointerLeave={handlePointerLeave}
    className="w-full h-full flex justify-center items-center text-center"
    >
        <h1 className="text-2xl text-white">Liveblocks figma clone</h1>
        
        {/* If cursor chat is enabled then show to all the members in the room */}
        {
          cursor && <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
          />
        }


        <LiveCursor others={others}/>
    </div>
  )
}

export default Live