
'use server';

import { db } from "@/lib/firebaseAdmin"
import { Timestamp } from "firebase/firestore";

export async function activatePendingGroupMembership(email: string) {
  const groupSnapShot = await db
    .collection("groups")
    .where("memberEmails", "array-contains", email)
    .get();

  const updatePromises: Promise<unknown>[] = [];

  groupSnapShot.forEach((doc) => {
    const groupData = doc.data();
    const members = Array.isArray(groupData.members) ? groupData.members : [];

    const memberIndex = members.findIndex(
      (m) => m.email === email && m.status === "pending"
    );

    if (memberIndex !== -1) {
      members[memberIndex].status = "active";
      members[memberIndex].userExists = true;

      updatePromises.push(
        db.collection("groups").doc(doc.id).update({ members })
      );
    }

    
    const groupActivityRef = db
  .collection("groups")
  .doc(doc.id)
  .collection("groupActivity");

updatePromises.push(
  groupActivityRef.add({
    type: "membership-activated",
    message: `${email} joined the group`,
    timestamp: Timestamp.now(),
    userEmail: email
  })
);

const notifyOthers = members
  .filter(m => m.email !== email && m.userExists)
  .map(m => {
    return db.collection("notifications").add({
      to: m.email,
      type: "group-update",
      groupId: doc.id,
      groupName: groupData.name,
      message: `${email} just joined your group "${groupData.name}"`,
      read: false,
      createdAt: Timestamp.now()
    });
  });

updatePromises.push(...notifyOthers);
  });

  await Promise.all(updatePromises);
}