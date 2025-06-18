import { NextRequest, NextResponse } from "next/server";
import { databases, users } from "@/Models/server/config";
import { answerCollection, db } from "@/Models/name";
import { ID } from "appwrite";
import { UserPrefs } from "@/store/AuthStore";

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();
    const response = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        content: answer,
        authorId: authorId,
        questionId: questionId,
      },
    ); // increase author reputation
    try {
      const prefs = await users.getPrefs<UserPrefs>(authorId);
      await users.updatePrefs(authorId, {
        reputation: Number(prefs.reputation || 0) + 5, // Add 5 points for providing an answer
      });
    } catch (userError) {
      console.error("Failed to update user reputation:", userError);
      // Continue with the response even if updating reputation fails
    }
    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error creating answer",
      },
      {
        status: error?.status || error?.code || 500,
      },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json();
    const answer = await databases.getDocument(db, answerCollection, answerId);
    const response = await databases.deleteDocument(
      db,
      answerCollection,
      answerId,
    ); // decrease reputation
    try {
      const prefs = await users.getPrefs<UserPrefs>(answer.authorId);
      await users.updatePrefs(answer.authorId, {
        reputation: Math.max(0, Number(prefs.reputation || 0) - 1), // Ensure reputation doesn't go below 0
      });
    } catch (userError) {
      console.error("Failed to update user reputation:", userError);
      // Continue with the response even if updating reputation fails
    }
    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Error Deleting the answer",
      },
      {
        status: error?.status || error?.code || 500,
      },
    );
  }
}
