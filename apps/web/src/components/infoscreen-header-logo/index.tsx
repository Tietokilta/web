import Image from "next/image";
import TiKLogoWhite from "../../assets/TiK-logo-white.svg";

export function InfoScreenHeaderLogo() {
  const GuildLogo = TiKLogoWhite
  return (
    <div className="h-[100px] w-[100px] p-3">
      <Image
        src={GuildLogo}
        alt="TiK Logo"
      />
    </div>
  )
}

export default InfoScreenHeaderLogo;
