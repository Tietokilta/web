import Image from "next/image";
import TiKLogo from "../../../assets/TiK-logo-white.png";

export function InfoScreenHeaderLogo() {
  return (
    <Image alt="Tietokilta" className="size-[6.0rem] p-2" priority src={TiKLogo} />
  );
}

export default InfoScreenHeaderLogo;
