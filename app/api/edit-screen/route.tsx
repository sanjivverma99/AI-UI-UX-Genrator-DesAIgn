import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const {projectId, screenId,oldCode}=await req.json();
    
}