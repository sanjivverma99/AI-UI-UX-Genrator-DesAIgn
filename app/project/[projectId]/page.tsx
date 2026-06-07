"use client";

import React, { useContext, useEffect, useState } from "react";
import ProjectHeader from "./_shared/ProjectHeader";
import SettingSection from "./_shared/SettingSection";
import axios from "axios";
import { useParams } from "next/navigation";
import { ProjectType, ScreenConfig } from "@/type/types";
import { Loader2Icon } from "lucide-react";
import Canvas from "./_shared/Canvas";
import { SettingContext } from "@/context/SettingContext";
import { RefreshDataContext } from "@/context/RefreshDataContext";

function projectCanvasPlayground() {
  const params = useParams();
  const projectId = params?.projectId as string;

  const [projectDetail, setProjectDetail] = useState<ProjectType | null>(null);

  const [screenConfigOriginal, setScreenConfigOriginal] = useState<
    ScreenConfig[]
  >([]);

  const [screenConfig, setScreenConfig] = useState<ScreenConfig[]>([]);

  const { settingsDetail, setSettingDetail } = useContext(SettingContext);

  const [loading, setLoading] = useState(false);

  const [loadingMsg, setLoadingMsg] = useState("Loading...");

  const { refreshData, setRefreshData } = useContext(RefreshDataContext);
  const [takeScreenshot, setTakeScreenshot] = useState(false);

  useEffect(() => {
    if (projectId) {
      GetProjectDetail();
    }
  }, [projectId]);

  useEffect(() => {
    if (refreshData?.method == "screenConfig") {
      GetProjectDetail();
    }
  }, [refreshData]);

  const GetProjectDetail = async () => {
    try {
      setLoading(true);
      setLoadingMsg("Loading Project...");

      const result = await axios.get(`/api/project?projectId=${projectId}`);

      console.log("API DATA:", result.data);

      setProjectDetail(result?.data?.projectDetail);

      setScreenConfigOriginal(result?.data?.screenConfig || []);

      setScreenConfig(result?.data?.screenConfig || []);

      setSettingDetail(result?.data?.projectDetail);
    } catch (error) {
      console.log("API ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectDetail || !screenConfigOriginal) return;

    if (screenConfigOriginal.length === 0) {
      generateScreenConfig();
      return;
    }

    const pendingScreens = screenConfig.filter((item: any) => !item?.code);

    if (pendingScreens.length > 0) {
      GenerateScreenUIX();
    }
  }, [projectDetail, screenConfigOriginal]);

  const generateScreenConfig = async () => {
    try {
      setLoading(true);

      setLoadingMsg("Generating Screen Config...");

      const result = await axios.post("/api/generate-config", {
        projectId: projectId,
        deviceType: projectDetail?.device,
        userInput: projectDetail?.userInput,
      });

      console.log(result.data);

      GetProjectDetail();
    } catch (error) {
      console.log("CONFIG ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const GenerateScreenUIX = async () => {
    try {
      setLoading(true);

      for (let index = 0; index < Math.min(screenConfig.length, 4); index++) {
        const screen = screenConfig[index];

        if (screen?.code) continue;

        setLoadingMsg(`Generating UI for screen ${index + 1}`);

        const result = await axios.post(
          "/api/generate-screen-ui",
          {
            projectId: projectId,
            screenId: screen?.screenID,
            screenName: screen?.screenName,
            purpose: screen?.purpose,
            screenDescription: screen?.screenDescription,
          },
          {
            timeout: 30000,
          },
        );

        console.log(result.data);

        setScreenConfig((prev: any) =>
          prev.map((item: any, i: number) =>
            i === index
              ? {
                  ...item,
                  code: result.data.code || result.data,
                }
              : item,
          ),
        );
      }
    } catch (error) {
      console.log("UI GENERATE ERROR:", error);
    } finally {
      setLoading(false);
    }
    setTakeScreenshot(true);
  };

  return (
    <div>
      <ProjectHeader />

      {loading && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white border shadow-lg rounded-xl p-4">
          <h2 className="flex gap-2 items-center text-sm font-medium">
            <Loader2Icon className="animate-spin h-4 w-4" />

            {loadingMsg}
          </h2>
        </div>
      )}

      <div className="flex gap-5">
        {/* SETTINGS */}

        <SettingSection
          projectDetail={projectDetail}
          screenDescription={screenConfig[0]?.screenDescription}
          takeScreenshot={() => setTakeScreenshot((prev) => !prev)}
        />

        {/* CANVAS */}

        <Canvas
          key={JSON.stringify(screenConfig)}
          projectDetail={projectDetail}
          screenConfig={screenConfig}
          takeScreenshot={takeScreenshot}
        />
      </div>
    </div>
  );
}

export default projectCanvasPlayground;
