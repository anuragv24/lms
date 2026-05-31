import { model, models, Schema } from "mongoose";

const BookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    pdfUrl: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {timestamps: true});

BookSchema.index({ title: 'text', author: 'text' });

const Book = models.Book || model('Book', BookSchema);

export default Book;