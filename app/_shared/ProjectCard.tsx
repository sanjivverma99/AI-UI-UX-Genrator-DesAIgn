import { ProjectType } from "@/type/types";
import Link from "next/link";
import Image from "next/image";
import React from "react";

type Props = {
  project: ProjectType;
};
function ProjectCard({ project }: Props) {
  return (
    <Link
      href={`/project/${project.projectId}`}
      className="rounded-2xl p-4 border hover:shadow-lg transition-shadow duration-300"
    >
      <div className="rounded-2xl  ">
       {project?.screenshot ? (
  <Image
    src={project.screenshot}
    alt={project?.projectName || "Project"}
    width={400}
    height={300}
    className="rounded-xl h-[150px] w-full object-cover"
  />
) : (
  <div className="rounded-xl h-[150px] w-full bg-gray-200 flex items-center justify-center">
    No Image
  </div>
)}
        {/* <Image src={project.screenshot as string} alt={project.projectName as string} 
        width={400} height={300} className='rounded-xl h-[300px] w-full bg-black'/> */}
        <h3 className="font-semibold text-lg mt-2">
          {project?.projectName || "Untitled Project"}
        </h3>
        <p className="text-sm text-gray-500">
          {project?.createdAt
            ? new Date(project?.createdAt).toLocaleDateString()
            : "Recent Project"}
        </p>
      </div>
    </Link>
  );
}

export default ProjectCard;
