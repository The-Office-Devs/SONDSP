import { cn } from "@/lib/utils";

export type KeyboardType = "letters" | "numbers";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = "0123456789".split("");

const KEY_CLASS = "flex touch-manipulation items-center justify-center rounded-xl border-2 border-slate-300 bg-white font-semibold text-slate-800 shadow-sm transition active:scale-95 active:bg-slate-100 disabled:opacity-40 disabled:active:scale-100";
const LETTER_KEY_CLASS = "h-12 w-[calc((100%_-_2.5rem)/6)] text-xl sm:h-16 sm:w-[calc((100%_-_4.5rem)/10)] sm:text-2xl";
const NUMBER_KEY_CLASS = "h-16 w-[calc((100%_-_2rem)/5)] text-2xl sm:h-20 sm:text-3xl";

interface AnswerKeyboardProps {
  type: KeyboardType;
  disabled?: boolean;
  onKeyPress: (key: string) => void;
}

export function AnswerKeyboard({ type, disabled = false, onKeyPress }: Readonly<AnswerKeyboardProps>) {
  const keys = type === "numbers" ? NUMBERS : LETTERS;

  return (
    <div
      role="group"
      className={cn("mx-auto w-full select-none space-y-2", type === "numbers" ? "max-w-xl" : "max-w-3xl")}
    >
      <div className="flex flex-wrap justify-center gap-2">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onKeyPress(key)}
            disabled={disabled}
            className={cn(KEY_CLASS, type === "numbers" ? NUMBER_KEY_CLASS : LETTER_KEY_CLASS)}
          >
            {key}
          </button>
        ))}
      </div>

      {type === "letters" && (
        <button
          type="button"
          onClick={() => onKeyPress(" ")}
          disabled={disabled}
          className={cn(KEY_CLASS, "mx-auto h-12 w-2/3 text-lg sm:h-16 sm:w-1/2 sm:text-xl")}
        >
          ESPAÇO
        </button>
      )}
    </div>
  );
}