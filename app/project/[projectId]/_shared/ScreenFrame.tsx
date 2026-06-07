"use client";

import { Rnd } from "react-rnd";
import { GripVertical } from "lucide-react";
import { THEMES } from "@/data/Themes";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { SettingContext } from "@/context/SettingContext";
import { ProjectType, ScreenConfig } from "@/type/types";
import ScreenHandler from "./ScreenHandler";
import { HtmlWrapper } from "@/data/constant";

type Props = {
  x: number;
  y: number;
  setPanningEnabled: (enabled: boolean) => void;
  width: number;
  height: number;
  htmlCode?: string;
  projectDetail?: ProjectType | null;
  screen: ScreenConfig;
  iframeRef: any;
};

function ScreenFrame({
  x,
  y,
  setPanningEnabled,
  width,
  height,
  htmlCode,
  projectDetail,
  screen,
  iframeRef,
}: Props) {
  const { settingsDetail } = useContext(SettingContext);
  const localIframeRef = useRef<HTMLIFrameElement | null>(null);

  const [size, setSize] = useState({
    width,
    height,
  });

  const html = useMemo(() => {
    return HtmlWrapper(
      THEMES,
      htmlCode || "",
      settingsDetail?.theme || projectDetail?.theme,
    );
  }, [htmlCode, settingsDetail?.theme, projectDetail?.theme]);

  useEffect(() => {
    setSize({
      width,
      height,
    });
  }, [width, height]);

  const measureIframeHeight = useCallback(() => {
    const iframe = localIframeRef.current;

    if (!iframe) return;

    try {
      const doc = iframe.contentDocument;

      if (!doc) return;

      const body = doc.body;

      const h = Math.max(body.scrollHeight, doc.documentElement.scrollHeight);

      setSize((prev) => ({
        ...prev,
        height: Math.max(h + 40, 300),
      }));
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const iframe = localIframeRef.current;

    if (!iframe) return;

    const onLoad = () => {
      measureIframeHeight();
    };

    iframe.addEventListener("load", onLoad);

    return () => {
      iframe.removeEventListener("load", onLoad);
    };
  }, [measureIframeHeight, html]);

  return (
    <Rnd
      size={size}
      position={{
        x,
        y,
      }}
      enableResizing={{
        bottomRight: true,
      }}
      dragHandleClassName="drag-handle"
      onDragStart={() => setPanningEnabled(false)}
      onDragStop={() => setPanningEnabled(true)}
      onResizeStart={() => setPanningEnabled(false)}
      onResizeStop={(_, __, ref) => {
        setPanningEnabled(true);

        setSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        overflow: "hidden",
        background: "white",
        boxShadow: "0 5px 15px rgba(0,0,0,.1)",
      }}
    >
      <div
        className="drag-handle"
        style={{
          height: "40px",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          borderBottom: "1px solid #eee",
          background: "white",
        }}
      >
        <GripVertical size={15} color="#999" />

        <ScreenHandler
          screen={screen}
          THEMES={THEMES}
          iframeRef={localIframeRef}
          projectId={projectDetail?.projectId}
        />
      </div>

      <iframe
        key={`${screen?.screenID}-${settingsDetail?.theme}`} // Force remount on theme change
        title={screen?.screenName}
        ref={(el) => {
          localIframeRef.current = el;

          if (typeof iframeRef === "function") {
            iframeRef(el);
          }
        }}
        sandbox="allow-scripts allow-same-origin"
        srcDoc={html}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "transparent",
        }}
      />
    </Rnd>
  );
}

export default ScreenFrame;
