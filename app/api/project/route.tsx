"use server";
import { db } from "@/config/db";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
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
        { status: 400 },
      );
    }

    const user = await currentUser();

// const {has} = await auth();
// const hasPremiumAccess = has({ Plan: 'unlimited' });
// const projects = await db.select().from(ProjectTable)
// .where(eq(ProjectTable.email, user?.emailAddresses[0].emailAddress!));
// if(projects.length >= 2 && !hasPremiumAccess){
//   return NextResponse.json({error: "Limit Exceeded"});
// }
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.insert(ProjectTable).values({
      projectId: projectId,
      userId: user.primaryEmailAddress.emailAddress,
      device: device,
      userInput: userInput ?? "",
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("PROJECT API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const email = user.primaryEmailAddress?.emailAddress;

  try {
    // All projects list
    if (!projectId) {
      const result = await db
        .select()
        .from(ProjectTable)
        .where(eq(ProjectTable.userId, email!))
        .orderBy(desc(ProjectTable.id));

      return NextResponse.json(result);
    }

    // Single project
    const results = await db
      .select()
      .from(ProjectTable)
      .where(
        and(
          eq(ProjectTable.projectId, projectId),
          eq(ProjectTable.userId, email!),
        ),
      );

    const screenConfig = await db
      .select()
      .from(ScreenConfigTable)
      .where(eq(ScreenConfigTable.projectId, projectId));

    return NextResponse.json({
      projectDetail: results[0],
      screenConfig,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { projectName, theme, projectId, screenshot } = await req.json();

  const result = await db
    .update(ProjectTable)
    .set({
      projectName: projectName,
      theme: theme,
      screenshot: screenshot,
    })
    .where(eq(ProjectTable.projectId, projectId))
    .returning();

  return NextResponse.json(result[0]);
}

function orderBy(arg0: any) {
  throw new Error("Function not implemented.");
}
