export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">frontend-starter</h1>
      <p className="text-sm opacity-70">
        Next.js 16 · React 19 · Tailwind 4 · Jotai · 4-layer
      </p>
      <ol className="list-decimal text-sm opacity-80 space-y-1 pl-5">
        <li>
          <code className="font-mono">.env.example</code> →{" "}
          <code className="font-mono">.env.local</code>
        </li>
        <li>
          Add your first feature under{" "}
          <code className="font-mono">features/&lt;name&gt;/</code>
        </li>
        <li>
          Replace this page in <code className="font-mono">app/page.tsx</code>
        </li>
      </ol>
    </div>
  );
}
