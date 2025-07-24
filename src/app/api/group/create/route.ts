
import { adminAuth } from '@/lib/firebaseAdmin';
import { db } from '@/lib/firebaseAdmin';
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {

       const authHeader = req.headers.get("authorization");
       const token = authHeader?.split("Bearer ")[1];

       if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decodedToken = await adminAuth.verifyIdToken(token);
        const userEmail = decodedToken.email;

       if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description, currency, icon, color,  membersList } = await req.json();
        if (!name || !description || !currency || !icon || !color || !membersList) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const createdBy = userEmail;

        if (!name || !description || !membersList || !createdBy) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const groupRef = db.collection("groups").doc();
        const memberWithStatus = await Promise.all(
            membersList.map(async (member: { email: string; [key: string]: unknown }) => {
                const userSnap = await db.collection("users").where("email", "==", member.email).limit(1).get();
                return {
                    ...member, 
                    userExists: !userSnap.empty,
                    status: userSnap.empty ? "pending" : "active",
                };
            })
        );
        console.log("Payload Incoming: ", {name, description, icon, color, currency, createdBy, membersList});
        const groupPayload = {
            name,
            description,
            icon,
            color,
            currency,
            createdBy : {
                uid : decodedToken.uid,
                email: decodedToken.email,
            },
            members: [
                {
                    email:decodedToken.email,
                    uid: decodedToken.uid,
                    status: "active",
                    userExists: true, // Assuming the creator is always a valid user
                }, ...memberWithStatus
            ],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };
        
        await groupRef.set(groupPayload);
        const notifyUsers = memberWithStatus.filter(member => member.userExists).map(member => {
            return db.collection("notifications").add({
                to: member.email,
                type: "group-invitation",
                groupName: name,
                groupId: groupRef.id,
                read: false,
                message: `${userEmail} has invited you to join the group "${name}"`,
                createdBy: userEmail,
                createdAt: Timestamp.now(),
            });
        });
        await Promise.all(notifyUsers);
        return NextResponse.json({ success: true, groupId: groupRef.id }, { status: 201 });
    } catch (error) {
        console.error("API Error creating group: ", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
    }
}