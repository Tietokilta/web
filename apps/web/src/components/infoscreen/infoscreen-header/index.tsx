import Image from "next/image";
import { PartnerLogos } from "@components/partner-logos";
import TiKLogo from "../../../assets/TiK-logo-white.png";
import { InfoScreenClock } from "./clock";

export function InfoScreenHeader() {
  return (
    <div className="flex h-[6.0rem] justify-between bg-black text-white">
      <div className="flex space-y-2">
        <Image
          alt="Tietokilta"
          className="size-[6.0rem] p-2"
          priority
          src={TiKLogo}
        />
        <InfoScreenClock />
      </div>
      <PartnerLogos style="row" size="large" partnerStatus="mainPartner" />
    </div>
  );
}
export default InfoScreenHeader;
