interface Props {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function QuestionInput({ value, onChange, placeholder, disabled }: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={6}
      className="w-full rounded-lg border border-black/10 bg-transparent p-4 text-base outline-none focus:border-black/40 disabled:opacity-60 dark:border-white/15 dark:focus:border-white/40"
    />
  );
}
