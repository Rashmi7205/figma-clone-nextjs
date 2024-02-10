"use client";
import { useMyPresence, useOthers } from "@/liveblocks.config"
import LiveCursor from "./cursor/LiveCursor"
import { useCallback,useState } from "react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode } from "@/types/types";

const Live = () => {

  const [cursorState, setCursorState] = useState({
    mode:CursorMode.Hidden,
  });
 
  const others = useOthers();
  const [{cursor},updateMyPresence] = useMyPresence() as any;
  const handlePointerMove = useCallback((event:React.PointerEvent)=>{
    event.preventDefault();
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientX - event.currentTarget.getBoundingClientRect().y;
    updateMyPresence({cursor:{x,y}});
  },[]);
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
  return (
  
    <div
    onPointerMove={handlePointerMove}
    onPointerDown={handlePointerDown}
    onPointerLeave={handlePointerLeave}
    className="h-full w-full flex justify-center items-center text-center"
    >
        <h1 className="text-2xl text-white">Liveblocks figma clone</h1>
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