import { ReactLenis } from "lenis/react";
export default async function ArchivePage() {
  return (
    <>
      <ReactLenis root />

      <div className="flex h-dvh w-full items-center justify-center">
        <h1 className="text-4xl font-semibold uppercase sm:text-7xl">
          Archive Page
        </h1>
      </div>
    </>
  );
}
