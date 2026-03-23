"use client";

import { useState } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [proposal, setProposal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    setIsLoading(true);
    setProposal("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      const data = await res.json();
      if (res.ok) {
        setProposal(data.proposal || "");
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate proposal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (proposal) {
      navigator.clipboard.writeText(proposal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-900 text-slate-50">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Sam’s Upwork Proposal Generator
          </h1>
          <p className="text-slate-400">
            Paste the job description below to generate a highly-converting, personalized proposal.
          </p>
        </div>

        <div className="space-y-4">
          <textarea
            className="w-full p-4 h-48 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans text-slate-200 resize-none shadow-sm placeholder:text-slate-500"
            placeholder="Paste the target job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={isLoading || !jobDescription.trim()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate Proposal</span>
            )}
          </button>
        </div>

        {proposal && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Generated Proposal</h2>
              <button
                onClick={handleCopy}
                className="text-sm px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors flex items-center space-x-1"
              >
                {copied ? (
                  <span className="text-green-400 font-medium">Copied!</span>
                ) : (
                  <span>Copy to Clipboard</span>
                )}
              </button>
            </div>
            <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 leading-relaxed whitespace-pre-wrap shadow-inner font-sans">
              {proposal}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
