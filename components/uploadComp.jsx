"use client"

import { uploadBookAction } from "@/actions/uploadAction";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function UploadComp(){
    const [loading, setLoadin] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState(null)
    const [error, setError] = useState(null);
    const router = useRouter();

    async function handleFormSubmit(e){
        e.preventDefault();
        setLoadin(true);
        setError(null);
        setUploadedUrl(null);
        
        const formData = new FormData(e.target);
        const result = await uploadBookAction(formData);

        setLoadin(false);
        if(result.success && result.data && result.data.url){
            console.log("Upload successful, file URL:", result.data.url);
            setUploadedUrl(result.data.url);
        } else {
            setError(result.message || "Upload failed");
        }
    }

    return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-950 p-8 rounded-xl border border-zinc-800 shadow-2xl">
        <h2 className="text-xl font-bold mb-2">Upload Test Sandbox</h2>
        <p className="text-sm text-zinc-400 mb-6">Verify binary PDF uploads directly to Cloudinary storage.</p>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Select Book PDF
            </label>
            <input 
              type="file" 
              name="bookPdf" 
              accept=".pdf"
              required
              className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-medium rounded-md transition duration-200"
          >
            {loading ? "Uploading to Cloudinary..." : "Upload File"}
          </button>
        </form>

        {/* Success Feedback Display Area */}
        {uploadedUrl && (
          <div className="mt-6 p-4 bg-emerald-950/50 border border-emerald-800 rounded-lg text-sm">
            <p className="text-emerald-400 font-medium mb-2">✓ Upload successful!</p>
            {/* <p className="text-xs text-zinc-400 break-all mb-3">{uploadedUrl}</p>
            <a 
              href={uploadedUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-block text-xs text-blue-400 underline hover:text-blue-300"
            >
              Test Live URL In New Tab →
            </a> */}
            <button onClick={()=> router.push("/demp")} >View</button>
          </div>
        )}

        {/* Error Feedback Display Area */}
        {error && (
          <div className="mt-6 p-4 bg-red-950/50 border border-red-900 rounded-lg text-sm text-red-400">
            <p className="font-medium">Upload Failed</p>
            <p className="text-xs mt-1 text-zinc-300">{error}</p>
          </div>
        )}
      </div>
    </div>
  );


}