"use server"

import { connectDB } from "@/lib/db";
import getAuthenticatedUser from "@/lib/getCurrentUser";
import Book from "@/models/Books";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadBookAction(formData){
    try {
        const user = await getAuthenticatedUser();
        if (!user || user.role !== 'admin') {
            return { success: false, message: "Unauthorized administrative access." };
        }

        const title = formData.get("title");
        const author = formData.get("author");
        const description = formData.get("description") || "";
        const file = formData.get("bookPdf");

        if (!title || !author) {
            return { success: false, message: "Title and Author inputs are required fields." };
        }
        
        if(!file || file.size === 0){
            return {success: false, message: "No file provided"};
        }

        const MAX_FILE_SIZE = 10 * 1024 * 1024; 
        if (file.size > MAX_FILE_SIZE) {
            return { 
                success: false, 
                message: `File size exceeds the allowable 10MB structural limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.` 
            };
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "books",
                    format: "pdf",
                }, (error, result) => {
                    if(error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        })

        if(!uploadResult || !uploadResult.secure_url){
            return {
                success: false,
                message: "Upload failed"
            };
        }

        await connectDB();
        const newBook = await Book.create({
            title: title.trim(),
            author: author.trim(),
            description: description?.trim() || "", 
            pdfUrl: uploadResult.secure_url,
        });

        revalidatePath("/books");

        return {
            success: true,
            message: "File uploaded successfully",
            data: {
                id: newBook._id.toString(),
                url: uploadResult.secure_url,
            }
        }
    } catch (error) {
        console.error("Upload error:", error);
        return {
            success: false,
            message: "File upload failed",
        }
    }
}