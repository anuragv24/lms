"use client"

import BookCard from "@/components/BookCard";
import UploadComp from "@/components/uploadComp";

export default function Home() {
  const book ={
    _id: 12345,
    title: "Random",
    author: "xyz",
    description: "abc",
    
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        
        {/* <UploadComp/> */}

        <BookCard 
          book={book}
          onBookmarkToggle={(id) => console.log("Toggled ID:", id)}
        />
        
      </main>
    </div>
  );
}
