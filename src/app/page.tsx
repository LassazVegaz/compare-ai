import { supportedModels } from "@/services/compare.service";
import ClientSide from "./components/ClientSide";
import KeyValuePair from "@/types/key-value-pair.type";

const specialKeywords: Record<string, string> = {
  openai: "OpenAI",
  xai: "xAI",
};

const checkboxes = supportedModels.map<KeyValuePair>((m) => {
  const parts = m
    .replaceAll("/", "-")
    .split("-")
    .map((p) => {
      if (p in specialKeywords) p = specialKeywords[p];
      else p = p[0].toUpperCase() + p.substring(1);
      return p;
    });

  return {
    key: m,
    value: parts.join(" "),
  };
});

export default function Home() {
  return (
    <div className="h-lvh py-4 px-8 grid grid-rows-[5fr_3fr]">
      <div className="flex gap-6 flex-col justify-center items-center">
        <h1 className="text-3xl">Compare Models</h1>
        <p>Select three models and compare with one input</p>
      </div>

      <ClientSide checkboxes={checkboxes} />
    </div>
  );
}
