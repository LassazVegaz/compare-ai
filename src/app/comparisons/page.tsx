import comparisonService from "@/services/comparison.service";
import Link from "next/link";

export default async function ComparisonsPage() {
  const history = await comparisonService.getAllComparisons();

  return (
    <div className="p-8 grid grid-rows-[auto_1fr] gap-8 w-lvw h-lvh">
      <h1 className="text-2xl text-center font-bold">Previous Comparisons</h1>
      <div className="flex flex-col gap-6 overflow-y-auto scrollbar-custom px-4">
        {history.map((item) => (
          <Link
            key={item.id}
            href={`/comparisons/${item.id}`}
            className="border p-4 mb-4 rounded hover:bg-gray-800 transition duration-300"
          >
            <h2 className="font-bold mb-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
              {item.prompt}
            </h2>
            <div className="text-sm text-gray-500 mb-4">
              Compared on: {new Date(item.createdAt).toLocaleString()}
            </div>
            <div className="flex flex-wrap gap-2">
              {item.responses.map((res) => (
                <div key={res.model} className="p-2 border rounded">
                  <p className="font-semibold">{res.model}</p>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
