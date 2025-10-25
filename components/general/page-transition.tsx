"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import Logo from "./logo";
import gsap from "gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const logoOverlayRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);
  const isTransitioning = useRef(false);

  const coverPage = useCallback(
    (url: string) => {
      const tl = gsap.timeline({
        onComplete: () => router.push(url),
      });
      if (!logoRef.current) return;

      const path = logoRef.current.querySelector("path");
      tl.to(blocksRef.current, {
        scaleX: 1,
        duration: 0.4,
        stagger: 0.02,
        ease: "power2.out",
        transformOrigin: "left",
      })
        .set(logoOverlayRef.current, { opacity: 1 }, "-=0.2")
        .set(
          path,
          {
            strokeDashoffset: path?.getTotalLength(),
            fill: "transparent",
          },
          "-=0.25",
        )
        .to(
          path,
          {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.inOut",
          },
          "-=0.5",
        )
        .to(
          path,
          {
            fill: "#e3e4d8",
            duration: 1,
            ease: "power2.out",
          },
          "-=0.5",
        )
        .to(logoOverlayRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
        });
    },
    [router],
  );

  const revealPage = useCallback(() => {
    gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });
    gsap.to(blocksRef.current, {
      scaleX: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      transformOrigin: "right",
      onComplete: () => {
        isTransitioning.current = false;
      },
    });
  }, []);

  useEffect(() => {
    const createBlocks = () => {
      if (!overlayRef.current) return;
      overlayRef.current.innerHTML = "";
      blocksRef.current = [];
      for (let i = 0; i < 20; i++) {
        const block = document.createElement("div");
        block.className = "block";
        overlayRef.current.appendChild(block);
        blocksRef.current.push(block);
      }
    };
    createBlocks();
    gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });

    if (logoRef.current) {
      const path = logoRef.current.querySelector("path");
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: "transparent",
        });
      }
    }
    revealPage();
    const handleRouteChange = (url: string) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      coverPage(url);
    };
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement | null;
        if (!target) return;

        const href = target.href;
        const url = new URL(href).pathname;
        if (url !== pathname) {
          handleRouteChange(url);
        }
      });
    });
    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", () => {});
      });
    };
  }, [pathname, revealPage, coverPage]);

  return (
    <>
      <div
        ref={overlayRef}
        className="pointer-events-none fixed top-0 left-0 z-2 flex h-dvh w-dvw"
      />
      <div
        ref={logoOverlayRef}
        className="pointer-events-none fixed top-0 left-0 z-2 flex h-dvh w-dvw items-center justify-center bg-[#222]  opacity-0"
      >
        <div className="flex size-[200px] flex-col items-center justify-center gap-y-2 p-5">
          <Logo ref={logoRef} />
        </div>
      </div>
      {children}
    </>
  );
}
