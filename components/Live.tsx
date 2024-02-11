"use client";
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from "@/liveblocks.config"
import LiveCursor from "./cursor/LiveCursor"
import { useCallback,useEffect,useState } from "react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/types";
import ReactionSelector from "./reaction/ReactionButton";
import FlyingReaction from "./reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";

const Live = () => {


  const [cursorState, setCursorState] = useState<CursorState>({
    mode:CursorMode.Hidden,
  });

  // Broadcast the reaction event to the others
  const broadcast = useBroadcastEvent(); 

  const [reaction,setReaction] = useState<Reaction[]>([]);
 
  const setReactions = useCallback((reaction:string)=>{
    setCursorState({mode:CursorMode.Reaction,
      reaction,
      isPressed:false
    })
  },[])

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


  // Clearing the reaction 
  useInterval(()=>{
    setReaction((reaction)=>reaction.filter((r)=>r.timestamp > Date.now() -4000));
  },100);


  // creating the flying reactions
  useInterval(()=>{
      if(cursorState.mode === CursorMode.Reaction &&
        cursorState.isPressed && cursor){
          setReaction((reactions)=>reactions.concat(
            [
              {
                point:{x:cursor.x,y:cursor.y},
                value:cursorState.reaction,
                timestamp:Date.now(),
              }
            ]
          ));
     // Broadcast the reaction to other users
          broadcast({
            x:cursor.x,
            y:cursor.y,
            value:cursorState.reaction
          });
        }
      
     
  },1);

  //set the broadcast data
  useEventListener((eventData)=>{
    const event = eventData.event as ReactionEvent
    setReaction((reactions)=>reactions.concat(
      [
        {
          point:{x:event.x,y:event.y},
          value:event.value,
          timestamp:Date.now(),
        }
      ]
    ));
  });



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

    //if the cursor is in the reaction mode set the pressed to true
    setCursorState((state:CursorState)=>(cursorState.mode === CursorMode.Reaction) ?{...state,isPressed:true}:state);

  },[cursorState.mode,setCursorState]);
  
  //hide the pointer when user move the mouse up
  const handlePointerUp = useCallback((e:React.PointerEvent)=>{
    setCursorState((state:CursorState)=>(cursorState.mode === CursorMode.Reaction) ?{...state,isPressed:false}:state);
  },[cursorState.mode,setCursorState]);

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
        setCursorState({
          mode:CursorMode.ReactionSelector
        });
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


        {/* Setting up the flying reactions */}
        {
          reaction.map((r)=>(<FlyingReaction
            key={r.timestamp.toString()}
            x={r.point.x}
            y={r.point.y}
            timestamp={r.timestamp}
            value={r.value}
          />))
        }
        
        {/* If cursor chat is enabled then show to all the members in the room */}
        {
          cursor && <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
          />
        }

      {/* If the reaction mode is on then show the reaction to all the memnbers in the room  */}

        {
          cursorState.mode === CursorMode.ReactionSelector && (
              <ReactionSelector 
              setReaction={setReactions} />

          )
        }

        <LiveCursor others={others}/>
    </div>
  )
}

export default Live