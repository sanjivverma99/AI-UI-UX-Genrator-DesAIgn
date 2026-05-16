import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import ScreenFrame from "./ScreenFrame";
import { useState } from "react";
import { ProjectType, ScreenConfig } from "@/type/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type props={
    projectDetail:ProjectType | null,
   screenConfig:ScreenConfig[],
    loading?:boolean

}
 function Canvas({projectDetail,screenConfig,loading}:props) {

    const [panningEnabled, setPanningEnabled] = useState(true);

    const isMobile = projectDetail?.device === "mobile";
    const SCREEN_WIDTH = isMobile ? 390:900;
    const SCREEN_HEIGHT = isMobile ? 800:800;
    const gap=isMobile ?10:20; 

    const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools absolute p-2 px-3 bg-white shadow flex gap-3 rounded-4xl bottom-10 left-1/2 z-30 text-gray-500">
      <Button variant={'outline'} size={'sm'} onClick={() => zoomIn()}><Plus/></Button>
      <Button variant={'outline'} size={'sm'} onClick={() => zoomOut()}><Minus/></Button>
      <Button variant={'outline'} size={'sm'} onClick={() => resetTransform()}><RefreshCw/></Button>
    </div>
  );
};

  return (
    <div className='w-full h-screen bg-sky-50'
    style = {{
  
backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
backgroundSize: "24px 24px",
backgroundColor: "#f1f5f9"
    }}
    >
      <TransformWrapper
      initialScale={0.7}
      minScale={0.7}
      maxScale={3}
      initialPositionX={50}
      initialPositionY={50}
      limitToBounds={false}
      wheel={{ step: 0.8 }}
      doubleClick={{ disabled: false}}
      panning={{disabled:!panningEnabled}}
      >
         {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Controls />
      <TransformComponent
      wrapperStyle={{ width: "100%", height: "100%" }}
        
      >
        {screenConfig?.map((screen, index) => (
          <div>
            {screen?.code? <ScreenFrame
               x={index * (SCREEN_WIDTH + gap)} y={0} 
               width={SCREEN_WIDTH}
                height={SCREEN_HEIGHT}
              key={index} setPanningEnabled={setPanningEnabled} 
              htmlCode={screen?.code}
              projectDetail={projectDetail}
              screen={screenConfig}
              />:
              <div className="bg-white rounded-2xl p-5 gap-4 flex flex-col"
              style={{
                width:SCREEN_WIDTH,
                height:SCREEN_HEIGHT

              }}
              >
                  <Skeleton className="w-full rounded-bl-lg h-10 bg-gray-300"/>
                  <Skeleton className="w-[50%] rounded-bl-lg h-20 bg-gray-300"/>
                  <Skeleton className="w-[70%] rounded-bl-lg h-30  bg-gray-300"/>
                  <Skeleton className="w-[30%] rounded-bl-lg h-15  bg-gray-300"/>
                   <Skeleton className="w-full rounded-bl-lg h-10  bg-gray-300"/>
                  <Skeleton className="w-[50%] rounded-bl-lg h-20  bg-gray-300"/>
                  <Skeleton className="w-[70%] rounded-bl-lg h-30  bg-gray-300"/>
                  <Skeleton className="w-[30%] rounded-bl-lg h-15  bg-gray-300"/>


              </div>}
              </div>
            ))}
       
      
      </TransformComponent>
      </>)}
    </TransformWrapper>
    </div>
  )
}

export default Canvas
