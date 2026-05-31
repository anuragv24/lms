
export default function Demo({pdfUrl}) {
  const staticBook = {
    title: "The Demo book",
    author: "Buddy",
    pdfUrl: pdfUrl || "https://res.cloudinary.com/dzymmiylj/image/upload/v1780074185/books/xy6nczhxbkwto6efskqv.pdf"
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-zinc-100 font-sans">
      <header className="flex justify-between items-center px-6 py-4 bg-zinc-950 border-b border-zinc-800 shadow-md">
        <div>
          <h1 className="text-lg font-bold tracking-tight">{staticBook.title}</h1>
          <p className="text-xs text-zinc-400">By {staticBook.author}</p>
        </div>
      </header>

      <main className="flex-1 bg-zinc-900 p-4 md:p-6 flex justify-center items-center">
        <div className="w-full h-full max-w-6xl bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden">
          
          <object
            data={staticBook.pdfUrl}
            type="application/pdf"
            className="w-full h-full"
          >
            {/* Fallback iframe using the same local path */}
            <iframe
              src={staticBook.pdfUrl}
              className="w-full h-full border-none"
              title="Local Book PDF Viewer"
            />
          </object>

        </div>
      </main>
    </div>
  );
}
