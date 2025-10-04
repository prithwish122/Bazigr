"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { cn } from "../lib/utils"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((v) => !v), [])
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [close])

  return (
    <header className="relative z-50">
      {/* centered ghost navbar: slightly curved ends, transparent whitish, no border */}
      <div className="mx-auto mt-4 w-full px-4">
        <nav
          aria-label="Primary"
          className={cn(
            "navbar-shell mx-auto flex items-center justify-between gap-4 rounded-[14px] px-4 md:px-5 py-1 backdrop-blur-md",
            "h-14 w-[min(88vw,560px)] md:w-[min(48vw,544px)]",
          )}
        >
          {/* left logo + wordmark */}
          <div className="flex items-center gap-2 pl-1">
            <span aria-hidden className="logo-dot" style={{ width: 22, height: 22 }} />
            <span className="text-sm md:text-base tracking-wide opacity-95">SKIPER-UI</span>
          </div>

          {/* right links + controls */}
          <div className="flex items-center gap-2">
            <ul className="hidden md:flex items-center gap-5 pr-1 text-sm md:text-base opacity-90">
              <li>
                <Link href="#" className="hover:opacity-100 focus:opacity-100 outline-none">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 focus:opacity-100 outline-none">
                  Components
                </Link>
              </li>
            </ul>

            {/* small rounded controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Command"
                className="nav-control grid h-8 w-8 place-items-center text-sm"
              >
                <span aria-hidden>⌘</span>
              </button>

              <button
                type="button"
                aria-label="Open Menu"
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={toggle}
                className="nav-control grid h-8 w-8 place-items-center"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 4H4v5M15 4h5v5M9 20H4v-5M20 20h-5v-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {open && (
        <div className="menu-scrim" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Expanded Menu"
            className="menu-panel animate-popdown"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="mx-auto flex max-w-[820px] flex-col items-center justify-center gap-4 text-center">
              {[
                "How to Use",
                "Legacy Version",
                "Pricing",
                "Components",
                "Get Support",
                "Founder",
                "Account",
                "Login",
              ].map((item) => (
                <li key={item} className="uppercase tracking-wide">
                  <Link
                    href="#"
                    onClick={close}
                    className="text-sm md:text-base font-semibold opacity-95 hover:opacity-100"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
