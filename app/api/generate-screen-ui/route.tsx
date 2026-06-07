import { db } from "@/config/db";
import { ScreenConfigTable } from "@/config/schema";
import { GENERATION_SCREEN_PROMPT } from "@/data/Prompt";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  
    const {
      projectId,
      screenId,
      screenName,
      purpose,
      screenDescription,
    } = await request.json();

    // Validation
    if (!projectId || !screenId) {
      return NextResponse.json(
        { error: "Missing projectId or screenId" },
        { status: 400 }
      );
    }

    // Short optimized prompt
    const userInput = `
Generate ONE UNIQUE modern mobile app screen.

Screen Name: ${screenName}

Purpose: ${purpose}

Description: ${screenDescription}

Rules:
- Generate only ONE screen
- No duplicate layout
- Modern colorful UI
- Use Tailwind CSS only
- Mobile responsive
- Premium design
- Return ONLY HTML code
`;
try {

    // OpenRouter API call
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model:  "google/gemini-3.1-flash-lite",
          max_tokens: 1500,

          temperature: 0.7,

          messages: [
            {
              role: "system",

              content:
                GENERATION_SCREEN_PROMPT +
                `

CRITICAL STYLING RULES:

1. Use ONLY Tailwind CSS classes
2. No inline CSS
3. Modern colorful mobile UI
4. Use cards, buttons, navbar
5. Use spacing properly
6. Use rounded corners
7. Add hover effects
8. Professional premium design
9. Mobile screen layout only
10. Return ONLY HTML code
`,
            },

            {
              role: "user",
              content: userInput,
            },
          ],
        }),
      }
    );

    // Error handling
    if (!response.ok) {
      const errorText = await response.text();

      console.error("OpenRouter Error:", response.status, errorText);

      // Rate limit handling
      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Rate limit reached. Please wait 20 seconds.",
          },
          {
            status: 429,
          }
        );
      }

      return NextResponse.json(
        {
          error: "AI generation failed",
          details: errorText,
        },
        {
          status: 500,
        }
      );
    }

    // Parse AI response
    const data = await response.json();

    const rawCode = data?.choices?.[0]?.message?.content;

    if (!rawCode) {
      return NextResponse.json(
        {
          error: "No content generated from AI",
        },
        {
          status: 500,
        }
      );
    }

    // Clean markdown
    const cleanedCode = rawCode
      .replace(/```html\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    // Save into database
    const updateResult = await db
      .update(ScreenConfigTable)
      .set({
        code: cleanedCode,
      })
      .where(
        and(
          eq(ScreenConfigTable.projectId, projectId),
          eq(ScreenConfigTable.screenID, screenId as string)
        )
      )
      .returning();

    return NextResponse.json(updateResult[0]);

  } 
  catch (error) {
    console.error("ERROR:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}