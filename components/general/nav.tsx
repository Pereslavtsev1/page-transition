import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed z-1 flex w-full items-center justify-between p-8">
      <div>
        <Link href="/" className="text-xl font-semibold uppercase">
          Silhouette
        </Link>
      </div>
      <div className="flex gap-x-8">
        <Link href={"/"} className="text-sm font-semibold uppercase">
          Index
        </Link>
        <Link href={"/archive"} className="text-sm font-semibold uppercase">
          Archive
        </Link>
        <Link href={"/contact"} className="text-sm font-semibold uppercase">
          Contact
        </Link>
      </div>
    </nav>
  );
}
