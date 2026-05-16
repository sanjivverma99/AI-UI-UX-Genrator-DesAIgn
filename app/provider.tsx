"use client";
import React,{useEffect,useState} from 'react';
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailContext';
import { SettingContext } from '@/context/SettingContext';
import { RefreshDataContext } from '@/context/RefreshDataContext';
function provider({children}: any) {
    
    const [userDetail,setUserDetail] =useState();
    const [settingsDetail, setSettingDetail]=useState();
    const [refreshData,setRefreshData]= useState();
    useEffect(() => {
        CreateNewUser();
      }, [])

    const CreateNewUser=async()=>{
       const result=await axios.post("/api/user",{
        anyData:"optinal"
       });
       
       console.log(result.data);
       setUserDetail(result?.data);
    }


  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      <SettingContext.Provider value={{settingsDetail, setSettingDetail}}>
   <RefreshDataContext.Provider value={{refreshData,setRefreshData}}>
   <div>{children}</div> 
   </RefreshDataContext.Provider>
</SettingContext.Provider>
    </UserDetailContext.Provider>
  )
}

export const useUserDetail = () => {
  const context = React.useContext(UserDetailContext);
  if (!context) {
    throw new Error('useUserDetail must be used within UserDetailContext.Provider');
  }
  return context;
};



export default provider

