"use server"

import { connectDB } from "@/lib/db"
import getAuthenticatedUser from "@/lib/getCurrentUser";
import Bookmark from "@/models/Bookmark"
import { revalidatePath } from "next/cache"



export async function toggleBookmarkAction(bookId){
    try {
        await connectDB();
        const user = await getAuthenticatedUser();
        if(!user){
            return {
                success: false,
                message: "Authentication failed"
            }
        }

        const existingBookmark  = await Bookmark.findOne({
            userId: user.id,
            bookId: bookId,
        });

        if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
    } else {
      await Bookmark.create({
        userId: user.id,
        bookId: bookId,
      });
    }

    revalidatePath('/books');
    revalidatePath('/bookmarks');

    return { success: true, message: "Bookmark toggled" };


    } catch (error) {
        console.error("BOOKMARK_TOGGLE_FAILURE:", error);
        return { success: false, message: 'Failed to update database bookmark node.' };
    }
}