"use client";
import { ProjectType } from "@/type/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";

function ProjectList() {
  const [projectList, setProjectList] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    GetProjectList();
  }, []);

  const GetProjectList = async () => {
    try {
      setLoading(true);

      const result = await axios.get("/api/project");

console.log("API Response:", result.data);
console.log("Is Array:", Array.isArray(result.data));

      if (Array.isArray(result.data)) {
  setProjectList(result.data.slice(0, 6));
} else {
  console.log("Not Array:", result.data);
  setProjectList([]);
}
    } catch (error) {
      console.log("API ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 md:px-24 lg:px-44">
      <h2 className="font-bold text-xl">My Projects</h2>

      {!loading && projectList.length === 0 && (
        <div className="p-6 border border-dashed rounded-3xl">
          <h2 className="text-center">No projects found</h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {!loading &&
          Array.isArray(projectList) &&
projectList.map((project, index) => (
            <ProjectCard key={project.projectId} project={project} />
          ))}{" "}
        {loading &&
          [1, 2, 3, 4, 5].map((item, index) => (
            <div key={index}>
              <Skeleton className="w-full h-[200px] rounded-2xl" />
              <Skeleton className="w-3/4 h-5 mt-2 rounded" />
              <Skeleton className="w-1/2 h-4 mt-1 rounded" />
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProjectList;
