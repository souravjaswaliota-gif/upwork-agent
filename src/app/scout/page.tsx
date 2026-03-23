"use client";
import { useState } from "react";

export default function ScoutPage() {
    const [query, setQuery] = useState("Find top 5 digital marketing portals in Dubai/UAE with traffic, cost, and criteria.");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const searchPortals = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/gemini", {
                method: "POST",
                body: JSON.stringify({ prompt: query }),
            });
            const data = await response.json();
            setResult(data.text);
        } catch (error) {
            setResult("Error searching for portals. Please check your connection.");
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-blue-600">UAE Market Scout Agent</h1>
            <p className="mb-6 text-gray-600">Enter your research criteria to find new business portals in the Gulf region.</p>

            <textarea
                className="w-full p-4 border rounded-lg mb-4 h-32 text-black"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <button
                onClick={searchPortals}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? "Searching UAE Portals..." : "Run Market Research"}
            </button>

            {result && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-black">Research Results:</h2>
                    <div className="whitespace-pre-wrap text-black leading-relaxed">{result}</div>
                </div>
            )}
        </div>
    );
}