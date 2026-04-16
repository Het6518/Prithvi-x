"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

export function GoogleTranslate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,gu,mr",
            layout: 0,
            autoDisplay: false
          },
          "google_translate_element"
        );
        setReady(true);
      }
    };
  }, []);

  return (
    <>
      <div
        id="google_translate_element"
        className={`google-translate-wrapper ${ready ? "gt-ready" : ""}`}
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <style jsx global>{`
        .google-translate-wrapper {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 90;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .google-translate-wrapper.gt-ready {
          opacity: 1;
        }
        /* hide google branding bar */
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        /* Neobrutalist dropdown style */
        .goog-te-gadget {
          font-family: var(--font-jakarta), sans-serif !important;
          font-size: 0 !important;
        }
        .goog-te-gadget .goog-te-combo {
          font-size: 13px !important;
          font-family: var(--font-jakarta), sans-serif !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          padding: 8px 14px;
          border: 3px solid #000;
          border-radius: 6px;
          background: #F5F0E8;
          color: #0E1A14;
          cursor: pointer;
          outline: none;
          box-shadow: 3px 3px 0px #000;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .goog-te-gadget .goog-te-combo:hover {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px #000;
        }
        .goog-te-gadget .goog-te-combo:focus {
          box-shadow: 0px 0px 0px #000;
          transform: translate(3px, 3px);
        }
        /* hide powered by text */
        .goog-te-gadget > span {
          display: none !important;
        }
        .goog-logo-link {
          display: none !important;
        }
        /* hide google translate tooltip */
        .goog-tooltip {
          display: none !important;
        }
        .goog-tooltip:hover {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        /* On small screens, position differently */
        @media (max-width: 768px) {
          .google-translate-wrapper {
            top: 8px;
            right: 8px;
          }
        }
      `}</style>
    </>
  );
}
