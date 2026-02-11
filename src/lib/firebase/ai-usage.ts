import { db } from "../firebase.client";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserUsage } from "@/types/ai-types";

const MAX_FREE_CALLS = 3;

export async function getUserUsage(uid: string): Promise<UserUsage> {
    const docRef = doc(db, "userUsage", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserUsage;
    } else {
        // Initialize new user usage
        const newUsage: UserUsage = {
            uid,
            aiCallsUsed: 0,
            lastUpdated: new Date().toISOString(),
        };
        await setDoc(docRef, newUsage);
        return newUsage;
    }
}

export async function incrementUsage(uid: string): Promise<void> {
    const docRef = doc(db, "userUsage", uid);
    const usage = await getUserUsage(uid);

    await updateDoc(docRef, {
        aiCallsUsed: usage.aiCallsUsed + 1,
        lastUpdated: new Date().toISOString(),
    });
}

export async function getRemainingCalls(uid: string): Promise<number> {
    const usage = await getUserUsage(uid);
    return Math.max(0, MAX_FREE_CALLS - usage.aiCallsUsed);
}

export function hasRemainingCalls(usage: UserUsage): boolean {
    return usage.aiCallsUsed < MAX_FREE_CALLS;
}
