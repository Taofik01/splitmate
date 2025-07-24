import { db } from "../firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function createGroup (
    name: string,
    description: string,
    members: string[],
    createdBy: string,
) {
    try {
    const groupRef = db.collection("groups").doc();
    const newGroup = {
        name,
        description,
        members,
        createdBy,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };
    await groupRef.set(newGroup);
    return { id: groupRef.id, ...newGroup };
} catch (error) {
    console.error("Error creating group: ", error);
    throw new Error("Failed to create group");
}

}