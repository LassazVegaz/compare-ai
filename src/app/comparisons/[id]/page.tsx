import { Message } from "@/generated/prisma/client";
import comparisonService from "@/services/comparison.service";
import humanizerService from "@/services/humanizer.service";
import { notFound } from "next/navigation";

const transformResponses = (r: Message) => {
  let totalPrice: number | undefined;
  if (
    r.inputTokenPrice &&
    r.outputTokenPrice &&
    r.inputTokens &&
    r.outputTokens
  ) {
    totalPrice =
      r.inputTokens * r.inputTokenPrice + r.outputTokens * r.outputTokenPrice;
  }

  return {
    ...r,
    humaizedModelName: humanizerService.humanizeModelId(r.model),
    totalTokens:
      r.inputTokens && r.outputTokens
        ? r.inputTokens + r.outputTokens
        : undefined,
    totalPrice,
  };
};

export default async function ComparisonResultsPage(
  props: Readonly<PageProps<`/comparisons/[id]`>>,
) {
  const { id } = await props.params;
  const results = await comparisonService.getSavedResults(id);

  if (!results) notFound();

  const responses = results.responses.map(transformResponses);

  return (
    <div className="h-lvh w-lvw py-4 px-8 grid gird grid-rows-[auto_1fr] gap-8">
      <h1 className="text-center text-4xl">Comparison Results</h1>

      <div className="grid grid-cols-3">
        {responses.map((r) => (
          <div
            key={r.model}
            className="px-10 not-last:border-r-2 border-gray-300 grid grid-rows-[auto_1fr_auto] gap-4"
          >
            <h1 className="text-xl text-center font-semibold">
              {r.humaizedModelName}
            </h1>

            <p>{r.text}</p>

            <div className="text-sm text-gray-500">
              <div className="tooltip">
                Total Price: ${r.totalPrice?.toFixed(8) ?? "N/A"}
                <div className="tooltiptext">
                  <div>
                    Input Tokens: {r.inputTokens ?? "N/A"} @ $
                    {r.inputTokenPrice?.toFixed(8) ?? "N/A"} / token
                  </div>
                  <div>
                    Output Tokens: {r.outputTokens ?? "N/A"} @ $
                    {r.outputTokenPrice?.toFixed(8) ?? "N/A"} / token
                  </div>
                </div>
              </div>
              <p>Total Tokens: {r.totalTokens ?? "N/A"}</p>
              <p>Time: {r.time} ms</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
