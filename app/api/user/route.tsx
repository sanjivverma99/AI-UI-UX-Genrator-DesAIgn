"use server";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/config/db"; 

export async function POST(request: Request) {
  try {
    const body = await request.json();

 
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const users = await db
      .select()
      .from(usersTable)
      .where(
        eq(
          usersTable.email,
          user.primaryEmailAddress.emailAddress
        )
      );

   
    if (users.length === 0) {
      await db.insert(usersTable).values({
        name: user.fullName ?? "",
        email: user.primaryEmailAddress.emailAddress,
      });
    }

  
    return NextResponse.json(
      {
        success: true,
        message: "User processed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}