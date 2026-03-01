"use client";
import Image from "next/image";
import {
  ChangeEvent,
  ChangeEventHandler,
  SubmitEventHandler,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import sendIcon from "@/../public/send-icon.png";
import KeyValuePair from "@/types/key-value-pair.type";
import { compareModels } from "../actions";
import { useRouter } from "next/navigation";

type ClientSideProps = {
  checkboxes: KeyValuePair[];
};

type ModelCheckboxProps = {
  label: string;
  checked: boolean;
  name: string;
  disabled: boolean;
  onChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
};

const MAX_CHECK_COUNT = 3;
const VALID_CHECK_COUNT = MAX_CHECK_COUNT;

const buildCheckboxesStates = (checkboxes: ClientSideProps["checkboxes"]) => {
  const state: Record<string, boolean> = {};
  for (const c of checkboxes) state[c.key] = false;
  return state;
};

const ModelCheckbox = (p: ModelCheckboxProps) => (
  <div
    className={twMerge(
      "flex gap-x-2 py-2 px-4 rounded-xl border border-blue-400",
      p.disabled && "opacity-[0.5]",
    )}
    aria-disabled={p.disabled}
  >
    <label>{p.label}</label>
    <input
      type="checkbox"
      name={p.name}
      checked={p.checked}
      onChange={p.onChange}
      disabled={p.disabled}
    />
  </div>
);

export default function ClientSide(props: Readonly<ClientSideProps>) {
  const router = useRouter();
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [checkedModels, setCheckedModels] = useState(
    buildCheckboxesStates(props.checkboxes),
  );
  const [checkedCount, setCheckedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setCheckedModels((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));

    setCheckedCount((prev) => prev + (e.target.checked ? 1 : -1));
  };

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const selectedModels: string[] = [];
    for (const c in checkedModels) if (checkedModels[c]) selectedModels.push(c);

    setIsLoading(true);
    try {
      const res = await compareModels(promptRef.current!.value, selectedModels);
      if (typeof res === "string") {
        router.push(`/comparisons/${res}`);
      } else {
        alert(res.message);
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="grid grid-rows-[auto_1fr]" onSubmit={onSubmit}>
      <div className="flex justify-between mb-6">
        {props.checkboxes.map((c) => (
          <ModelCheckbox
            key={c.key}
            checked={checkedModels[c.key]}
            disabled={!checkedModels[c.key] && checkedCount === MAX_CHECK_COUNT}
            label={c.value}
            name={c.key}
            onChange={handleCheckboxChange}
          />
        ))}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-x-4">
        <textarea
          required
          ref={promptRef}
          className="border outline-none rounded-xl p-4 scrollbar-custom"
        />
        <button
          type="submit"
          disabled={checkedCount !== VALID_CHECK_COUNT}
          className="self-center rounded-full cursor-pointer disabled:opacity-[0.4] disabled:cursor-default"
        >
          <Image src={sendIcon} alt="send button" className="w-12" />
        </button>
      </div>

      <div
        className={twMerge(
          "absolute top-0 left-0 w-lvw h-lvh bg-[#000000C0] flex justify-center items-center",
          !isLoading && "hidden",
        )}
      >
        <div className="border-8 w-48 h-48 animate-[spiner_1s_linear_infinite]"></div>
      </div>
    </form>
  );
}
