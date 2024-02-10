import CursorSVG from '@/public/assets/CursorSVG'
import { CursorChatProps, CursorMode } from '@/types/types'
import React from 'react'

const CursorChat = ({cursor,cursorState,setCursorState,updateMyPresence}:CursorChatProps) => {
 
  const handleChange = (e :React.ChangeEvent<HTMLInputElement>)=>{

  }
  const handleKeyDown = (e :React.ChangeEvent<HTMLInputElement>)=>{

  }
  
  
  return (
    <div
    className='absolute top-0 let-0'
    style={{transform:`translateX(${cursor.x}px) translateY(${cursor.y}px)`}}
    >
      {/* {cursorState.mode===CursorMode.Chat &&}( */}
      <> 
        <CursorSVG color='#000'/>
        <div className='absolute top-5 left-2 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white rounded-[20px]'>
          {cursorState.previousMessage && (
            <div>
                {cursorState.previousMessage}
                <input type="text" 
                className='z-10 w-60 border-none bg-transparent text-white outline-none placeholder-blue-500'
                autoFocus={true}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={cursorState.previousMessage ? "": "Say Something"}
                />
              </div>
          )}
        </div>
      </>
      
      {/*) } */}
      
    </div>
  )
}

export default CursorChat