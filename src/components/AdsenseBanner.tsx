"use client";

import { useState, useEffect } from "react";

type BannerPosition = "top" | "bottom" | "inline";

interface AdsenseBannerProps {
  position: BannerPosition;
}

export default function AdsenseBanner({ position }: AdsenseBannerProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <div className={`adsense-banner-${position} w-full text-center py-4 bg-gray-50 border border-gray-200`}>
      {position === "top" && (
        <div className="flex justify-center items-center gap-2 mb-2 text-xs text-gray-500">
          <span>?? Ads</span>
          <span>?</span>
          <span>Sponsored content</span>
        </div>
      )}
      <div
        className="adsense-ad-wrapper max-w-720 mx-auto"
        data-ad-client="ca-pub-9901133369141996"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></div>
      {position === "bottom" && (
        <div className="flex justify-center items-center gap-2 mt-2 text-xs text-gray-500">
          <span>?? Ads</span>
          <span>?</span>
          <span>Sponsored content</span>
        </div>
      )}
    </div>
  );
}
