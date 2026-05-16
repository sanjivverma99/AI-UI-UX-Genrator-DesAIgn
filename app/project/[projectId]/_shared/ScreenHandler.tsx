import { Button } from '@/components/ui/button';
import { ScreenConfig } from '@/type/types'
import { Code2Icon, Copy, Download, GripVertical, MoreVertical, Sparkle, SparkleIcon, Trash } from 'lucide-react'
import React, { useContext } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { toast } from 'sonner';
import { HtmlWrapper } from '@/data/constant';
import html2canvas from 'html2canvas'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from 'axios';
import { RefreshDataContext } from '@/context/RefreshDataContext';
import { Textarea } from '@/components/ui/textarea';
type Props={
   screen:ScreenConfig,
   THEMES:any,
   iframeRef:any,
   projectId:string | undefined
}
function ScreenHandler({screen,THEMES,iframeRef,projectId}:Props) {

const htmlCode = HtmlWrapper(THEMES,screen?.code as string)
const {refreshData,setRefreshData} = useContext(RefreshDataContext);



const takeIframeScreenshot = async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        const body = doc.body;

        // wait one frame to ensure layout is stable
        await new Promise((res) => requestAnimationFrame(res));

        const canvas = await html2canvas(body, {
            backgroundColor: null,
            useCORS: true,
            scale: window.devicePixelRatio || 1,
        });

        const image = canvas.toDataURL("image/png");

        // download automatically
        const link = document.createElement("a");
        link.href = image;
        link.download = `${screen.screenName || "screen"}.png`;
        link.click();
    } catch (err) {
        console.error("Screenshot failed:", err);
    }
};

const onDelete = async() => {
     const result = await axios.delete('/api/generate-config?projectId='+projectId+"&screenId"+screen?.screenID)
     toast.success('Screen Deleted')
     setRefreshData({method:'screenConfig', data: Date.now})
}



  return (
    <div className='flex justify-baseline items-center w-full'>
        <div className="flex items-center gap-2">
       <GripVertical size={14} color="#9ca3af"/>
       <h2>{screen?.screenName}</h2>
</div>

<div >

  <Dialog>
    <DialogTrigger>
      <Button variant={'ghost'} size={'icon-sm'}>
        <Code2Icon />
      </Button>
    </DialogTrigger>

    <DialogContent className='max-w-5xl w-full h-[70vh] flex flex-col'>
      <DialogHeader>
        <DialogTitle>
          HTML + Tailwindcss Code
        </DialogTitle>

        <DialogDescription>

          <div className='flex-1 overflow-y-auto rounded-md border bg-muted p-2'>

            {/* @ts-ignore */}
            <SyntaxHighlighter
              language="HTML"
              style={docco}
              customStyle={{
                margin: 0,
                padding: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowX: 'hidden',
                height: '50vh'
              }}
              codeTagProps={{
                style: {
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }
              }}
            >
              {htmlCode}
            </SyntaxHighlighter>

          </div>

          <Button
            className='mt-3'
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

  <Button variant={'outline'} onClick={takeIframeScreenshot}>
    <Download size={18} />
  </Button>

<Popover>
<PopoverTrigger> 
  <Button variant={'destructive'}><SparkleIcon /></Button>
  </PopoverTrigger>
<PopoverContent>
  <div>
    <Textarea placeholder='what changes you want to make'/>
    <Button size={'sm'} className='mt-2'><Sparkle/>Regenrate</Button>
  </div>
</PopoverContent>
</Popover>


  <DropdownMenu>

    <DropdownMenuTrigger asChild>
      <Button variant="ghost">
        <MoreVertical />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">

      <DropdownMenuGroup>

        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete()}
        >
          <Trash />
          Delete
        </DropdownMenuItem>

      </DropdownMenuGroup>

    </DropdownMenuContent>

  </DropdownMenu>

</div>

    </div>
  )
}

export default ScreenHandler
