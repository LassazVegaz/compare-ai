import sendIcon from "@/../public/send-icon.png";
import { supportedModels } from "@/services/compare.service";
import Image from "next/image";

const specialKeywords: Record<string, string> = {
  openai: "OpenAI",
  xai: "xAI",
};

const checkboxes = supportedModels.map((m) => {
  const parts = m
    .replaceAll("/", "-")
    .split("-")
    .map((p) => {
      if (p in specialKeywords) p = specialKeywords[p];
      else p = p[0].toUpperCase() + p.substring(1);
      return p;
    });

  return {
    value: m,
    label: parts.join(" "),
  };
});

export default function Home() {
  return (
    <div className="h-lvh py-4 px-8 grid grid-rows-[5fr_auto_2fr]">
      <div className="flex gap-6 flex-col justify-center items-center">
        <h1 className="text-3xl">Compare Models</h1>
        <p>Select three models and compare with one input</p>
      </div>

      <div className="flex justify-between mb-6">
        {checkboxes.map((c) => (
          <div
            key={c.value}
            className="flex gap-x-2 py-2 px-4 rounded-xl border border-blue-400"
          >
            <label htmlFor={c.value}>{c.label}</label>
            <input type="checkbox" name={c.value} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-x-4">
        <textarea className="border outline-none rounded-xl p-4 scrollbar-custom" />
        <button className="self-center rounded-full cursor-pointer">
          <Image src={sendIcon} alt="send button" className="w-12" />
        </button>
      </div>
    </div>
  );
}
