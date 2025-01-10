"use client";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import TiKLogo from "../../../assets/TiK-logo-white.png";

const Clock = dynamic(() => import("react-live-clock"), { ssr: false });

export function InfoScreenHeader() {
  return (
    <div className="flex h-[6.0rem] space-y-2 bg-black text-white">
      <Image
        alt="Tietokilta"
        className="size-[6.0rem] p-2"
        priority
        src={TiKLogo}
      />
      <div className="flex h-full flex-col">
        <Clock
          format="HH:mm:ss"
          style={{
            color: "white",
            fontSize: "2.0rem",
            paddingLeft: "1rem",
            alignItems: "center",
          }}
          timezone="EET"
          ticking
        />
        <Clock
          format="Do MMMM"
          style={{
            color: "white",
            fontSize: "1.2rem",
            paddingLeft: "1rem",
            alignItems: "center",
          }}
          ticking
        />
      </div>
    </div>
  );
}
export default InfoScreenHeader;
