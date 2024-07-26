import {NextRequest, NextResponse} from "next/server";
import {databases, users} from "@/Models/server/config";
import {answerCollection, db} from "@/Models/name";
import {ID} from "appwrite";
import {UserPrefs} from "@/store/Auth";

export async function POST(request: NextRequest) {
    try {
        const {questionId, answer, authorId} = await request.json();
        const response = await databases.createDocument(db, answerCollection, ID.unique(), {
            content: answer,
            authorId: authorId,
            questionId: questionId
        })

        // increase author reputation
        const prefs = await users.getPrefs<UserPrefs>(authorId)
        await users.updatePrefs(authorId, {
            reputation: Number(prefs.reputation)
        })
        return NextResponse.json(response,
            {
                status: 201
            }
        )
    } catch (error: any) {
        return NextResponse.json({
            error: error?.message || "Error creating answer"
        }, {
            status: error?.status || error?.code || 500
        })
    }
}

export async function DELETE(request: NextResponse) {
    try {
        const {answerId} = await request.json();
        const answer = await databases.getDocument(db, answerCollection, answerId);
        const response = await databases.deleteDocument(db, answerCollection, answerId);

        // decrease reputation

        const prefs = await users.getPrefs<UserPrefs>(answer.authorId);
        await users.updatePrefs(answerId.authorId, {
            reputation: Number(prefs.reputation) - 1
        })
        return NextResponse.json({data: response}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({
            message: error?.message || "Error Deleting the answer",
        }, {
            status: error?.status || error?.code || 500
        })
    }
}