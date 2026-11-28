import type { ComponentProps } from "react";
import { ALERT_TYPES, type AlertType } from "@lib/plugins/remark-gfm-alerts";
import { cn } from "@lib/utils";

const headerColors: Record<AlertType, { bar: string; dot: [string, string] }> =
  {
    note: {
      bar: "bg-gray-100",
      dot: ["bg-secondary-600", "bg-primary-600"],
    },
    tip: { bar: "bg-success-500", dot: ["bg-success-700", "bg-success-700"] },
    important: {
      bar: "bg-secondary-500",
      dot: ["bg-secondary-700", "bg-secondary-700"],
    },
    warning: {
      bar: "bg-warning-500",
      dot: ["bg-warning-700", "bg-warning-700"],
    },
    caution: {
      bar: "bg-danger-500",
      dot: ["bg-danger-700", "bg-danger-700"],
    },
  };

const isAlertType = (value: unknown): value is AlertType =>
  ALERT_TYPES.includes(value as AlertType);

/**
 * Renders GitHub-style alerts (see `remarkGfmAlerts`) as callout boxes styled
 * like the landing page announcement card. Plain blockquotes render as is.
 */
export function MarkdownBlockquote({
  node: _node,
  children,
  ...props
}: ComponentProps<"blockquote"> & { node?: unknown }) {
  const type = (props as Record<string, unknown>)["data-alert"];
  if (!isAlertType(type)) {
    return <blockquote {...props}>{children}</blockquote>;
  }

  const colors = headerColors[type];
  return (
    <div
      className="my-6 overflow-hidden rounded-md border-2 border-gray-900 bg-gray-100 shadow-solid"
      role="note"
      aria-label={type}
    >
      <div
        className={cn(
          "not-prose flex justify-between border-b-2 border-gray-900 p-2 font-mono text-gray-900",
          colors.bar,
        )}
        aria-hidden="true"
      >
        <div className="flex w-5 gap-1">
          {colors.dot.map((dot, i) => (
            <span
              // eslint-disable-next-line react/no-array-index-key -- static list
              key={i}
              className={cn("h-2 w-2 rounded-full border border-gray-900", dot)}
            />
          ))}
        </div>
        <span className="self-center text-sm font-medium">{type}.md</span>
        <div className="w-5" />
      </div>
      <div className="px-4 py-3 md:px-6 [&>:first-child:not(blockquote)]:mt-0 [&>:last-child:not(blockquote)]:mb-0">
        {children}
      </div>
    </div>
  );
}
