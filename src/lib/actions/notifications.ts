
import { db } from "../firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export const addActivationNotification = async (
    email: string,
    groupId: string,
    groupName: string 
) => {
    await db.collection("notifications").add({
        to: email,
        type: "activation",
        message:   `You're now an active member of the group "${groupName}"`,
        groupId,
        read: false,
        createdAt: Timestamp.now(),
    });
};