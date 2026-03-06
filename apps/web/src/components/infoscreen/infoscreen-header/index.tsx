import Image from "next/image";
import { PartnerLogos } from "@components/partner-logos";
import TiKLogo from "../../../assets/TiK-logo-white.png";
import { InfoscreenClock } from "./clock";

export function InfoScreenHeader() {
  return (
    <div className="flex h-32 justify-between bg-black p-4 text-white">
      <div className="flex h-20 space-y-2">
        <Image
          alt="Tietokilta"
          className="size-24 p-2"
          priority
          src={TiKLogo}
        />
        <InfoscreenClock />
      </div>
      <div className="mx-10 flex h-24 space-y-2">
        <PartnerLogos
          statuses={["mainPartner"]}
          size="medium"
          type="infoscreen"
        />
      </div>
    </div>
  );
}
export default InfoScreenHeader;
