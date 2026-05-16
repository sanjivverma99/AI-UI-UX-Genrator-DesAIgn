"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SettingContext } from '@/context/SettingContext';
import { THEME_NAME_LIST, THEMES } from '@/data/Themes'
import { ProjectType } from '@/type/types';
import { Camera, Share, Sparkle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'

type props = {
  projectDetail: ProjectType | null;
}
function SettingSection({ projectDetail }:props) {

  const [selectedTheme, setSelectedTheme] = useState('AURORA_INK');
  const[projectName, setProjectName] = useState(projectDetail?.projectName );
  const [userNewScreenInput, setUserNewScreenInput] = useState<String>(); 
  const {settingsDetail,setSettingDetail}=useContext(SettingContext);
  
  
  useEffect(()=>{
    projectDetail&& setProjectName(projectDetail.projectName)
    setSelectedTheme(projectDetail?.theme as string)
  },[projectDetail?.projectName])

  const onThemeSelect=(theme:string)=>{
    setSelectedTheme(theme);
    setSettingDetail((prev:any)=>({
      ...prev,
      theme:theme
    }))
  }

  return (
    <div className='w-75 h-[90vh] p-5 border-r'>
      <h2 className='font-medium text-lg'>Setting</h2>
    
      <div className='mt-3'>
      <h2 className='text-sm mb-1'>Project Name</h2>
      <Input placeholder='project Name'
      value={projectName || ""}
      onChange={(event)=>{setProjectName(event.target.value)
        setSettingDetail((prev: any) => ({
          ...prev,
          projectName: projectName
        }))
      }}
      />
    </div>

    <div className='mt-5'>
      <h2 className='text-sm mb-1'>Generate New Screen</h2>
      <Textarea placeholder='Enter prompt tp genrate  screen using AI '
      onChange={(event)=>setUserNewScreenInput(event.target.value)}
      />
      <Button
 size={'sm'}
 className='mt-3 w-full rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 text-white shadow-xl hover:scale-[1.02] transition-all duration-300'
><Sparkle/>Generate With AI</Button>
    </div>

  <div className='mt-5'>
      <h2 className='text-sm mb-1'>Themes</h2>
      <div className='h-50 overflow-auto'>
        <div>
          {THEME_NAME_LIST.map((theme,index)=>(
            <div key={index} className={`p-3 border rounded-xl mb-2 
             ${theme == selectedTheme && 'border-primary bg-purple-200'} `}
            onClick={()=>onThemeSelect(theme)}>
              <h2>{theme}</h2>
              <div className='flex gap-2'>
              <div className={`h-4 w-4 rounded-full   ` }
              style={{background: THEMES[theme].primary}}
              />
               <div className={`h-4 w-4 rounded-full ` }
              style={{background: THEMES[theme].secondary}}
              />
               <div className={`h-4 w-4rounded-full  ` }
              style={{background: THEMES[theme].accent}}
              />
               <div className={`h-4 w-4 rounded-full ` }
              style={{background: THEMES[theme].background}}
              />
              <div
              className='h-4 w-4 rounded-full'
              style={{
                background:`linear-gradient(
                135deg,
                ${THEMES[theme].background} ,
                ${THEMES[theme].primary} ,
                ${THEMES[theme].accent} 
              )`,
              
              }}
              />
              </div>
              </div>
          ))}
        </div>
    </div>
    </div>
     
    
      <h2 className='text-sm mb-1'>Extras</h2>
      <div className='flex gap-3'>
      <div className='flex '>
      <Button size={'sm'} variant={'outline'} className='mt-2 max-w-full'><Camera/>Screenshort</Button>
      <Button size={'sm'} variant={'outline'} className='mt-2 max-w-full'><Share/>Share</Button>
    </div>
    </div>
    </div>
    

  )
}

export default SettingSection
