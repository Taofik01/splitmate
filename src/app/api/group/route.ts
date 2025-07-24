import { NextResponse } from "next/server";
import { createGroup } from "@/lib/actions/addGroup";

export async function POST(req: Request) {
    try {
        const { name, description, members, createdBy } = await req.json();

        if (!name || !description || !members || !createdBy) {
            return NextResponse.json({ error: "Missing required fields"}, { status: 400 });
        }

            const group = await createGroup(name, description, members, createdBy);
            return NextResponse.json(group, { status: 201});
    } catch (error: unknown ) {
        if (error instanceof Error) {
            console.error("API Error creating group: ", error.message);
        } 
        return NextResponse.json({ error: "Failed to create group" }, { status: 500 });

    }
}
