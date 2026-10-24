import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-px section text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-ink/70">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/shop" className="btn-outline">Shop Products</Link>
      </div>
    </div>
  );
}
