import { supportedModels } from "@/services/comparison.service";
import ClientSide from "./components/ClientSide";
import KeyValuePair from "@/types/key-value-pair.type";
import humanizerService from "@/services/humanizer.service";

const checkboxes = supportedModels.map<KeyValuePair>((m) => ({
  key: m,
  value: humanizerService.humanizeModelId(m),
}));

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
