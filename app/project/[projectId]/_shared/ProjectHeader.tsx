import { Button } from "@/components/ui/button";
import { SettingContext } from "@/context/SettingContext";
import axios from "axios";
import { Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { toast } from "sonner";

function ProjectHeader() {
  const { settingsDetail, setSettingDetail } = useContext(SettingContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const OnSave = async () => {
    try {
      setLoading(true);

      const result = await axios.put("/api/project", {
        theme: settingsDetail?.theme,
        projectId: settingsDetail?.projectId,
        projectName: settingsDetail?.projectName,
        screenshot: settingsDetail?.screenshot,
      });
      setLoading(false);
      toast.success("setting Saved!");
    } catch (e) {
      setLoading(false);
      toast.error("Internal server Error");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 shadow">
       <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => router.push("/")}
              >
                <Image src="/uiux logo.png" alt="logo" width={40} height={40} />
                <h2 className="text-xl font-semibold">
                  Des<span className="text-pink-400">AIgn</span>
                </h2>
              </div>
      <Button onClick={OnSave} disabled={loading} variant={"destructive"}>
        {" "}
        {loading ? <Loader2 className="animate-spin" /> : <Save />} Save
      </Button>
    </div>
  );
}

export default ProjectHeader;
