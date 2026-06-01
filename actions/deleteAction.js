"use server"


// actions/deleteAction.js
"use server"

import { connectDB } from "@/lib/db";
import getAuthenticatedUser from "@/lib/getCurrentUser";
import Bookmark from "@/models/Bookmark";
import Book from "@/models/Books";
import { revalidatePath } from "next/cache";

export async function deleteBookAction(bookId) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'admin') {
      return { success: false, message: "Unauthorized administrative access. Purge request blocked." };
    }

    await connectDB();

    await Bookmark.deleteMany({ bookId: bookId });

    const deletedBook = await Book.findByIdAndDelete(bookId);
    
    if (!deletedBook) {
      return { success: false, message: "Book not found inside the database catalog entries." };
    }

    revalidatePath("/books");
    revalidatePath("/bookmarks");

    return { success: true, message: "Volume deleted successfully." };

  } catch (error) {
    console.error("ADMIN_DELETE_BOOK_CRASH:", error);
    return { success: false, message: error.message || "Failed to delete book entry." };
  }
}