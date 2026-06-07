import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import ScreenFrame from "./ScreenFrame";
import { useEffect, useRef, useState } from "react";
import { ProjectType, ScreenConfig } from "@/type/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import axios from "axios";

type props = {
  projectDetail: ProjectType | null;
  screenConfig: ScreenConfig[];
  loading?: boolean;
  takeScreenshot: any;
};
function Canvas({
  projectDetail,
  screenConfig,
  loading,
  takeScreenshot,
}: props) {
  const [panningEnabled, setPanningEnabled] = useState(true);

  const isMobile = projectDetail?.device === "mobile";
  const SCREEN_WIDTH = isMobile ? 390 : 900;
  const SCREEN_HEIGHT = isMobile ? 800 : 800;
  const gap = isMobile ? 10 : 20;

  const iframeRef = useRef<(HTMLIFrameElement | null)[]>([]);

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
      <div className="tools absolute p-2 px-3 bg-white shadow flex gap-3 rounded-4xl bottom-10 left-1/2 z-30 text-gray-500">
        <Button variant={"outline"} size={"sm"} onClick={() => zoomIn()}>
          <Plus />
        </Button>
        <Button variant={"outline"} size={"sm"} onClick={() => zoomOut()}>
          <Minus />
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => resetTransform()}
        >
          <RefreshCw />
        </Button>
      </div>
    );
  };

  useEffect(() => {
    if (takeScreenshot) {
      setTimeout(() => {
        onTakeScreenshot(false);
      }, 500);
    }
  }, [takeScreenshot]);

  const captureOneIframe = async (iframe: HTMLIFrameElement) => {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error("iframe doc not ready");

    // wait fonts if possible
    // @ts-ignore
    if (doc.fonts?.ready) await doc.fonts.ready;

    // let iconify/tailwind apply
    await new Promise((r) => setTimeout(r, 250));

    const target = doc.body; // or doc.documentElement
    const w = doc.documentElement.scrollWidth;
    const h = doc.documentElement.scrollHeight;

    const canvas = await html2canvas(target, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      width: w,
      height: h,
      windowWidth: w,
      windowHeight: h,
      scale: window.devicePixelRatio || 1,
    });

    return canvas;
  };

  const onTakeScreenshot = async (saveOnly = false) => {
    try {
      const iframes = iframeRef.current.filter((iframe) => iframe !== null);

      console.log("Iframe count:", iframes.length);

      if (iframes.length === 0) {
        toast.error("No iframes loaded");
        return;
      }
      // 1) capture each iframe to its own canvas
      const shotCanvases: HTMLCanvasElement[] = [];
      for (let i = 0; i < iframes.length; i++) {
        const c = await captureOneIframe(iframes[i]);
        shotCanvases.push(c);
      }

      // 2) stitch into one final canvas (side-by-side)
      const scale = window.devicePixelRatio || 1;
      const headerH = 40; // same as your header
      const outW =
        Math.max(iframes.length * (SCREEN_WIDTH + gap), SCREEN_WIDTH) * scale;
      const outH = SCREEN_HEIGHT * scale;

      const out = document.createElement("canvas");
      out.width = outW;
      out.height = outH;

      const ctx = out.getContext("2d");
      if (!ctx) throw new Error("No 2D context");

      // optional transparent background
      ctx.clearRect(0, 0, outW, outH);

      // draw each screen capture
      for (let i = 0; i < shotCanvases.length; i++) {
        const x = i * (SCREEN_WIDTH + gap) * scale;
        const y = headerH * scale; // because iframe capture is body only
        ctx.drawImage(shotCanvases[i], x, y);
      }

      // 3) download
      const url = out.toDataURL("image/png");
      console.log(url);
      updateProjectWithScreenshot(url);
      if (!saveOnly) {
        const a = document.createElement("a");
        a.href = url;
        a.download = "canvas.png";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error(e);
      toast.error("Capture failed (iframe)");
    }
  };

  const updateProjectWithScreenshot = async (base64Url: string) => {
    try {
      const result = await axios.put("/api/project", {
        screenshot: base64Url,
        projectId: projectDetail?.projectId,
        theme: projectDetail?.theme,
        projectName: projectDetail?.projectName,
      });

      console.log("Screenshot Saved:", result.data);
      toast.success("Screenshot saved successfully");
    } catch (error) {
      console.log(error);
      toast.error("Screenshot save failed");
    }
  };

  return (
    <div
      className="w-full h-screen bg-sky-50"
      style={{
        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        backgroundColor: "#f1f5f9",
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
        doubleClick={{ disabled: false }}
        panning={{ disabled: !panningEnabled }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <Controls />
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
            >
              {screenConfig?.map((screen, index) => (
                <div key={screen?.screenID || index}>
                  {screen?.code ? (
                    <ScreenFrame
                      x={index * (SCREEN_WIDTH + gap)}
                      y={0}
                      width={SCREEN_WIDTH}
                      height={SCREEN_HEIGHT}
                      setPanningEnabled={setPanningEnabled}
                      htmlCode={screen?.code}
                      projectDetail={projectDetail}
                      screen={screen}
                      iframeRef={(el: any) => {
                        iframeRef.current[index] = el;
                      }}
                    />
                  ) : (
                    <div
                      className="bg-white rounded-2xl p-5 gap-4 flex flex-col"
                      style={{
                        width: SCREEN_WIDTH,
                        height: SCREEN_HEIGHT,
                      }}
                    >
                      <Skeleton className="w-full h-10 bg-gray-300" />
                      <Skeleton className="w-[50%] h-20 bg-gray-300" />
                      <Skeleton className="w-[70%] h-30 bg-gray-300" />
                      <Skeleton className="w-[30%] h-15 bg-gray-300" />
                      <Skeleton className="w-full h-10 bg-gray-300" />
                      <Skeleton className="w-[50%] h-20 bg-gray-300" />
                      <Skeleton className="w-[70%] h-30 bg-gray-300" />
                      <Skeleton className="w-[30%] h-15 bg-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export default Canvas;
