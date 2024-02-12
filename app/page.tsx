"use client";

import Leftsidebar from "@/components/Leftsidebar";
import Live from "@/components/Live";
import Rightsidebar from "@/components/Rightsidebar";
import { useEffect, useRef } from "react";
import fabric from 'fabric';
import { initializeFabric } from "@/lib/canvas";


export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef (false);


  useEffect(()=>{

    const canvas = initializeFabric({fabricRef,canvasRef})


  },[]);

  return (
      <div className="w-full h-screen overflow-hidden">
        
        <section className="flex flex-row h-full">
        <Leftsidebar/>
        <Live />
        <Rightsidebar/>
        </section>

      </div>
  );
}