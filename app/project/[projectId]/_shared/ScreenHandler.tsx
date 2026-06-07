import { Button } from "@/components/ui/button";
import { ScreenConfig } from "@/type/types";
import {
  Code2Icon,
  Download,
  GripVertical,
  Loader2Icon,
  MoreVertical,
  Sparkle,
  SparkleIcon,
  Trash,
} from "lucide-react";

import React, { useContext, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";
import { HtmlWrapper } from "@/data/constant";
import html2canvas from "html2canvas";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import axios from "axios";
import { RefreshDataContext } from "@/context/RefreshDataContext";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { SettingContext } from "@/context/SettingContext";

type Props = {
  screen: ScreenConfig;
  THEMES: any;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  projectId: string | undefined;
};

function ScreenHandler({ screen, THEMES, iframeRef, projectId }: Props) {
  const { settingsDetail } = useContext(SettingContext);

  const htmlCode = HtmlWrapper(
    THEMES,
    screen?.code as string,
    screen?.selectedTheme as string,
  );

  const { setRefreshData } = useContext(RefreshDataContext);

  const [editUserInput, setEditUserInput] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const takeIframeScreenshot = async () => {
    try {
      console.log("iframeRef =", iframeRef);
      console.log("iframe =", iframeRef?.current);

      const iframe = iframeRef.current;

      if (!iframe) {
        toast.error("Iframe not found");
        return;
      }

      const doc = iframe.contentDocument;

      if (!doc) {
        toast.error("Iframe content not loaded");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const canvas = await html2canvas(doc.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Blob generation failed");
          return;
        }

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${screen.screenName}.png`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        toast.success("Download Complete");
      }, "image/png");
    } catch (error) {
      console.error(error);
      toast.error("Screenshot Failed");
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(
        `/api/generate-config?projectId=${projectId}&screenId=${screen?.screenID}`,
      );

      toast.success("Screen Deleted");

      setRefreshData({
        method: "screenConfig",
        data: new Date().getTime(),
      });
    } catch {
      toast.error("Delete failed");
    }
  };

  const editScreen = async () => {
    try {
      setLoading(true);
      toast.success("Regenerating Screen...");
      const result = await axios.post("/api/edit-screen", {
        projectId: projectId,
        screenId: screen?.screenID,
        userInput: `
      Current theme: ${settingsDetail?.theme || "AURORA_INK"}.
      Apply this theme colors strictly.
      ${editUserInput}
   `,
        theme: settingsDetail?.theme,
        oldCode: screen?.code,
      });

      toast.success("Screen Edited successfully");
      setRefreshData({
        method: "screenConfig",
        data: new Date().getTime(),
      });

      router.refresh();
    } catch {
      toast.error("Failed to regenerate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-2">
        <GripVertical size={14} color="#9ca3af" />

        <h2>{screen?.screenName}</h2>
      </div>

      <div className="flex gap-2">
        {/* CODE VIEW */}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <Code2Icon />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-7xl w-[95vw] h-[85vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>HTML + Tailwind CSS</DialogTitle>

              <DialogDescription>
                <div className="overflow-x-auto overflow-y-auto border rounded-md p-2 h-[70vh] w-full">
                  <SyntaxHighlighter
                    language="html"
                    style={docco}
                    wrapLongLines={true}
                    wrapLines={true}
                    customStyle={{
                      margin: 0,
                      minHeight: "50vh",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      maxWidth: "100%",
                      fontSize: "12px",
                    }}
                  >
                    {htmlCode}
                  </SyntaxHighlighter>
                </div>

                <Button
                  className="mt-3"
                  onClick={() => {
                    navigator.clipboard.writeText(htmlCode as string);

                    toast.success("Code Copied!");
                  }}
                >
                  Copy
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={takeIframeScreenshot}>
          <Download size={18} />
        </Button>

        {/* REGENERATE */}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="destructive">
              <SparkleIcon />
            </Button>
          </PopoverTrigger>

          <PopoverContent>
            <div>
              <Textarea
                placeholder="What changes you want?"
                onChange={(e) => setEditUserInput(e.target.value)}
              />

              <Button
                size="sm"
                className="mt-2"
                disabled={loading}
                onClick={editScreen}
              >
                {loading ? (
                  <Loader2Icon className="animate-spin mr-2" />
                ) : (
                  <Sparkle className="mr-2" />
                )}
                Regenerate
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* MENU */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="text-red-500 cursor-pointer"
                onSelect={onDelete}
              >
                <Trash className="mr-2 h-4 w-4" />

                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default ScreenHandler;
