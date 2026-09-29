export default function RootNotFound() {
  return (
    <html lang="fr">
      <body className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 text-center text-white">
        <div className="max-w-md">
          <h1 className="text-6xl font-black">404</h1>
          <p className="mt-4 text-sm text-white/60">
            Cette page n&apos;existe pas.
          </p>
          <a
            href="/"
            className="mt-6 inline-block rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-black transition hover:bg-white/90"
          >
            Retour à l&apos;accueil
          </a>
        </div>
      </body>
    </html>
  );
}
