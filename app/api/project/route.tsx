"use server"
import { db } from "@/config/db";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
   
    const body = await req.json();

    const projectId = body?.projectId;
    const userInput = body?.userInput;
    const device = body?.device;

    if (!projectId || !device) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }


    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await db.insert(ProjectTable).values({
      projectId: projectId,
      userId: user.primaryEmailAddress.emailAddress,
      device: device,
      userInput: userInput ?? "",
    });

    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("PROJECT API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId") as string;
  const user = await currentUser();

  if (!projectId) {
    return NextResponse.json({ error: "No projectId" });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }

  const email = user.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Email missing" });
  }

  try {
    const results = await db.select().from(ProjectTable)
      .where(and(
        eq(ProjectTable.projectId, projectId),
        eq(ProjectTable.userId, email)
      ));

    const screenConfig = await db.select().from(ScreenConfigTable)
      .where(eq(ScreenConfigTable.projectId, projectId));

    return NextResponse.json({
      projectDetail: results[0],
      screenConfig: screenConfig
    });

  } catch (e) {
    console.log("ERROR:", e);
    return NextResponse.json({ error: "Failed" });
  }
}

export async function PUT(req:NextRequest) {
  const { projectName,theme, projectId} = await req.json();
  
  const result = await db.update(ProjectTable).set({
    projectName: projectName,
    theme: theme,
    projectId
  }).returning();

  return NextResponse.json(result[0])
}