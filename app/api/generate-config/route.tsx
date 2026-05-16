import { db } from "@/config/db";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/Prompt";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();

    const { deviceType, userInput, projectId } = body;

    // Validation
    if (!deviceType || !userInput || !projectId) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // AI Prompt
    const prompt = `
Generate ONLY 4 UNIQUE mobile app screens.

Rules:
- Maximum 4 screens only
- No duplicate screens
- Each screen must be different
- Modern premium UI
- Mobile app layout
- Return ONLY valid JSON
- No markdown
- No explanation

Device: ${deviceType}

Project Idea:
${userInput}
`;

    // AI API Call
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: "llama-3.1-8b-instant",

          max_tokens: 1500,

          temperature: 0.7,

          messages: [
            {
              role: "system",

              content:
                APP_LAYOUT_CONFIG_PROMPT.replace(
                  "{device}",
                  deviceType
                ) +
                `
IMPORTANT:
- Return ONLY valid JSON
- Generate EXACTLY 4 screens
- No more than 4
- No duplicate screen names
`,
            },

            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    // Error Handling
    if (!response.ok) {

      const errorText = await response.text();

      console.error(
        "Groq Error:",
        response.status,
        errorText
      );

      return NextResponse.json(
        {
          error: "Groq API failed",
          details: errorText,
        },
        {
          status: 500,
        }
      );
    }

    // Parse AI Response
    const data = await response.json();

    const rawContent =
      data?.choices?.[0]?.message?.content;

    if (!rawContent) {

      console.error("No content from AI:", data);

      return NextResponse.json(
        {
          error: "No content from AI",
        },
        {
          status: 500,
        }
      );
    }

    // Clean markdown JSON
    let JSONRes;

    try {

      const cleaned = rawContent
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();

      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found");
      }

      JSONRes = JSON.parse(jsonMatch[0]);

    } catch (e) {

      console.error(
        "JSON parse error:",
        rawContent
      );

      return NextResponse.json(
        {
          error: "Invalid JSON from AI",
          raw: rawContent,
        },
        {
          status: 500,
        }
      );
    }

    // Update Project Table
    if (JSONRes) {

      await db
        .update(ProjectTable)
        .set({

          projectVisualDescription:
            JSONRes?.projectVisualDescription
              ? String(
                  JSONRes.projectVisualDescription
                )
              : null,

          projectName:
            JSONRes?.projectName
              ? String(JSONRes.projectName)
              : null,

          theme:
            JSONRes?.theme
              ? typeof JSONRes.theme === "object"
                ? JSON.stringify(JSONRes.theme)
                : String(JSONRes.theme)
              : null,
        })
        .where(
          eq(
            ProjectTable.projectId,
            projectId as string
          )
        );
    }

    // Insert Screens
    if (
      JSONRes?.screens &&
      Array.isArray(JSONRes.screens)
    ) {

      // Remove duplicates
      const uniqueScreens =
        JSONRes.screens.filter(
          (
            screen: any,
            index: number,
            self: any[]
          ) =>
            index ===
            self.findIndex(
              (s) =>
                s.name?.toLowerCase() ===
                screen.name?.toLowerCase()
            )
        );

      // Limit only 4 screens
      const limitedScreens =
        uniqueScreens.slice(0, 4);

      // Update response
      JSONRes.screens = limitedScreens;

      // Delete old screens
      await db
        .delete(ScreenConfigTable)
        .where(
          eq(
            ScreenConfigTable.projectId,
            projectId as string
          )
        );

      // Insert only 4 screens
      for (const screen of limitedScreens) {

        await db
          .insert(ScreenConfigTable)
          .values({
            projectId: projectId,

            purpose: screen?.purpose,

            screenDescription:
              screen?.layoutDescription,

            screenID:
              screen?.id ||
              crypto.randomUUID(),

            screenName:
              screen?.name ||
              "Untitled Screen",
          });
      }
    }

    return NextResponse.json(JSONRes);

  } catch (error) {

    console.error("ERROR:", error);

    return NextResponse.json(
      {
        error: "Server error",
        details: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE SCREEN API

export async function DELETE(req: NextRequest) {

  const projectId =
    req.nextUrl.searchParams.get("projectId");

  const screenId =
    req.nextUrl.searchParams.get("screenId");

  const user = await currentUser();

  if (!user) {

    return NextResponse.json(
      {
        message: "Unauthorized User",
      },
      {
        status: 401,
      }
    );
  }

  await db
    .delete(ScreenConfigTable)
    .where(
      and(
        eq(
          ScreenConfigTable.screenID,
          screenId as string
        ),

        eq(
          ScreenConfigTable.projectId,
          projectId as string
        )
      )
    );

  return NextResponse.json({
    message: "Deleted",
  });
}