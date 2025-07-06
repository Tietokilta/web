import { type GoogleFormBlockNode } from "@lexical-types";

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
