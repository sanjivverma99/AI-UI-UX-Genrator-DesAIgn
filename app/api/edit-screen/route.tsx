import { db } from "@/config/db";
import { ScreenConfigTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Request body
    const { projectId, screenId, oldCode, userInput, theme } = await req.json();

    // Prompt

    const PROMPT = `
Theme: ${theme}

Modify existing UI:
${userInput}

Old code:
${oldCode}

Rules:
- Keep selected theme colors
- Use gradients
- Use colorful cards
- Rounded design
- Modern UI
- Don't generate plain white screens
`;

    // OpenRouter API Call
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: "google/gemini-3.1-flash-lite",

          messages: [
            {
              role: "user",
              content: `
${userInput}

Rules:
- Do not use Button component
- Use only plain HTML tags
- Use only div, button, input, img
- Never nest button inside button
- Return only HTML with Tailwind classes
- No JSX
`,
            },
          ],

          max_tokens: 1500,
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();
    const generatedCode = data.choices[0].message.content
      .replace(/```html/g, "")
      .replace(/```tsx/g, "")
      .replace(/```jsx/g, "")
      .replace(/```/g, "")
      .replace(/<Button/g, "<div")
      .replace(/<\/Button>/g, "</div>")
      .trim();
    // Update database
    const updateResult = await db
      .update(ScreenConfigTable)
      .set({
        code: generatedCode,
      })
      .where(
        and(
          eq(ScreenConfigTable.projectId, projectId),
          eq(ScreenConfigTable.screenID, screenId),
        ),
      )
      .returning();

    return NextResponse.json(updateResult[0]);
  } catch (e) {
    return NextResponse.json({ msg: "Internal server error" });
  }
}
