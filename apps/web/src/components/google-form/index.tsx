import { type GoogleFormBlockNode } from "@tietokilta/cms-types/lexical";

export function GoogleForm({
  link,
}: {
  link: GoogleFormBlockNode["fields"]["link"];
}) {
  return (
    <div className="w-[95vw] sm:w-[640px]">
      <iframe src={link} width="100%" height="1000" title="Google form">
        Loading…
      </iframe>
    </div>
  );
}
