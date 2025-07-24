import { db } from "@/lib/firebaseAdmin"

export async function activatePendingGroupMembership(email: string) {
    const groupSnapShot = await db.collection("groups").get();

    const updatePromises: unknown[] = [];

    groupSnapShot.forEach((doc) => {
        const groupData = doc.data();
        const members = groupData.members as { email: string; status: string; userExists?: boolean }[];

        const memberIndex = members.findIndex(
            (m) => m.email === email && m.status === "pending"
        );
        if (memberIndex !== -1){
            members[memberIndex].status = "active";
            members[memberIndex].userExists = true;

            updatePromises.push(
                db.collection("groups").doc(doc.id).update({ members })
            );
        }
     });

     await Promise.all(updatePromises);
}