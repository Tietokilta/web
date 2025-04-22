export function CustomIframe({ url, title }: { url: string; title: string }) {
  return (
    <iframe src={url} title={title} className="size-full overflow-hidden" />
  );
}
