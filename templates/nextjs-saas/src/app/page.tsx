export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">
        {process.env.NEXT_PUBLIC_APP_NAME ?? "App"}
      </h1>
    </main>
  );
}
