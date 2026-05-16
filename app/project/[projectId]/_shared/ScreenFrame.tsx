import { Rnd } from "react-rnd";
import { GripVertical } from "lucide-react";
import { THEMES, themeToCssVars } from "@/data/Themes";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SettingContext } from "@/context/SettingContext";
import { ProjectType, ScreenConfig } from "@/type/types";
import ScreenHandler from "./ScreenHandler";
import { HtmlWrapper } from "@/data/constant";

type props = {
  x: number;
  y: number;
  setPanningEnabled: (enabled: boolean) => void;
  width: number;
  height: number;
  htmlCode?: string | undefined;
  projectDetail?: ProjectType | null;
  screen: ScreenConfig[];
}

function ScreenFrame({
  x, y, setPanningEnabled, width, height, htmlCode, projectDetail, screen}: props) {

  const {settingsDetail, setSettingDetail} = useContext(SettingContext);

  const selectedThemeKey = (settingsDetail?.theme ??
    projectDetail?.theme) as keyof typeof THEMES;

  //@ts-ignore
  const themeKey = [settingsDetail?.thme ?? projectDetail?.theme]
  const iframeRef = useRef<HTMLIFrameElement|null>(null);

  // keep manual resize + auto in same state
  const [size, setSize] = useState({width,height});

  const resizingLockedRef = useRef(false);
  const lastThemeRef = useRef<string | undefined>(undefined);
// build html with theme css vars

  const html = HtmlWrapper(THEMES,htmlCode as string)

  useEffect(()=>{
    setSize((s) =>({
     width: width ?? s.width,
     height:height ?? s.height,
    }));
  },[width,height]);
  


  const measureIframeHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const headerH = 40;
      const htmlEl = doc.documentElement;
      const body = doc.body;

      const contentH = Math.max(
        htmlEl?.scrollHeight ?? 0,
        body?.scrollHeight ?? 0,
        htmlEl?.offsetHeight ?? 0,
        body?.offsetHeight ?? 0
      );

      const next = Math.min(Math.max(contentH + headerH, 160), 2000);

      setSize((s) => (Math.abs(s.height - next) > 2 ? { ...s, height: next } : s));
    } catch {
      // if sandbox/origin blocks access, we can't measure
    }
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      measureIframeHeight();

      const doc = iframe.contentDocument;
      if (!doc) return;

      const observer = new MutationObserver(() => measureIframeHeight());
      observer.observe(doc.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      const t1 = window.setTimeout(measureIframeHeight, 50);
      const t2 = window.setTimeout(measureIframeHeight, 200);
      const t3 = window.setTimeout(measureIframeHeight, 600);

      return () => {
        observer.disconnect();
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.clearTimeout(t3);
      };
    };

    iframe.addEventListener("load", onLoad);
    window.addEventListener("resize", measureIframeHeight);

    return () => {
      iframe.removeEventListener("load", onLoad);
      window.removeEventListener("resize", measureIframeHeight);
    };
  }, [measureIframeHeight, htmlCode]);

  return (
    <Rnd
      default={{ x, y, width, height }}
      size={size}
      dragHandleClassName='drag-handle'
      enableResizing={{ bottomRight: true, bottomLeft: true }}
      onDragStart={()=>setPanningEnabled(false)}
      onDragStop={()=>setPanningEnabled(true)}
      onResizeStart={()=>setPanningEnabled(false)}
      onResizeStop={(_,__,ref,___,position)=>{setPanningEnabled(true)
        setSize({
          width:ref.offsetWidth,
          height:ref.offsetHeight
        })
      }}
      style={{
        border: '1.5px solid #d1d5db',
        borderRadius: '10px',
        overflow: 'hidden',
        background: 'white',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Drag Handle */}
      <div
        className="drag-handle"
        style={{
          padding: '5px 12px',
          borderBottom: '1px solid #e5e7eb',
          cursor: 'move',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: '#6b7280',
          background: 'white',
          userSelect: 'none',
          flexShrink: 0,
          height: '30px'
        }}
      >
        <ScreenHandler screen={screen[0]} THEMES={THEMES} iframeRef={iframeRef}/>
      </div>

      {/* iframe */}
      <iframe
        style={{
          width: '100%',
          flex: 1,
          border: 'none',
          background: 'white',
          display: 'block'
        }}
        ref={iframeRef}
        sandbox='allow-same-origin allow-scripts'
        srcDoc={html}
      />
    </Rnd>
  );
}

export default ScreenFrame;