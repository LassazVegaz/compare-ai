"use client";
import { useState } from "react";
import { compareModels } from "./actions";

export default function Home() {
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Enter your prompt here..."
      />
      <button
        className="bg-blue-500 text-white p-2 mt-2"
        onClick={async () => {
          try {
            setLoading(true);
            const res = await compareModels("What is the capital of France?");
            setResponses(res);
          } catch (e) {
            console.error("Error comparing models:", e);
            alert(
              "An error occurred while comparing models. Please try again.",
            );
          } finally {
            setLoading(false);
          }
        }}
      >
        Compare Models
      </button>

      <div className="mt-4">
        {responses.map((res, idx) => (
          <div key={idx} className="border p-2 mb-2">
            <h3 className="font-bold">Model {idx + 1} Response:</h3>
            <p>{res}</p>
          </div>
        ))}
      </div>

      {loading && <p>Loading responses...</p>}
    </div>
  );
}
