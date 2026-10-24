import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="AYURM home">
      <Image src="/logo.png" alt="Ayurm" width={180} height={48} priority />
    </Link>
  );
}
