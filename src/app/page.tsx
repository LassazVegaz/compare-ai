"use client";
import { useState } from "react";
import { compareModels } from "./actions";
import CallModelResponse from "@/types/model-response.type";

export default function Home() {
  const [responses, setResponses] = useState<CallModelResponse[]>([]);
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
        {responses.map((res) => (
          <ResponseCard key={res.model.toString()} res={res} />
        ))}
      </div>

      {loading && <p>Loading responses...</p>}
    </div>
  );
}

type ResponseCardProps = {
  res: CallModelResponse;
};

const ResponseCard = (p: ResponseCardProps) => {
  return (
    <div className="border p-2 mb-2">
      <h3 className="font-bold">{p.res.model.toString()} Response</h3>
      <p>{p.res.text}</p>
      {p.res.totalTokens !== undefined && (
        <p className="text-sm text-gray-500">
          Total Tokens Used: {p.res.totalTokens}
        </p>
      )}
      <p className="text-sm text-gray-500">
        Time Taken: {p.res.timeTakenMs} ms
      </p>
    </div>
  );
};
