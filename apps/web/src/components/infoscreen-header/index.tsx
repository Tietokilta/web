'use client'
import InfoScreenHeaderLogo from "../infoscreen-header-logo";
import Clock from "react-live-clock";
import React from "react";

export function InfoScreenHeader() {
  return(
    <div className="h-[6.0rem] bg-black text-white space-y-2 flex">
      <InfoScreenHeaderLogo />
      <div className="h-full flex flex-col">
        <Clock
          format="HH:mm:ss"
          style={{color: "white", fontSize: "2.0rem", paddingLeft: "1rem", alignItems: "center"}}
          ticking />
        <Clock
          format="Do MMMM[ta]"
          locale={"fi-FI"}
          style={{color: "white", fontSize: "1.2rem", paddingLeft: "1rem", alignItems: "center"}}
          ticking />
      </div>
    </div>
  )
}
export default InfoScreenHeader;

