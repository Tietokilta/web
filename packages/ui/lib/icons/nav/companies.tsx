import type { LucideIcon } from "lucide-react";
import * as React from "react";

const NavCompaniesIcon: LucideIcon = React.forwardRef(
  (
    {
      width = "64",
      height = "64",
      viewBox = "0 0 64 64",
      fill = "#ffffff",
      xmlns = "http://www.w3.org/2000/svg",
      ...rest
    },
    ref,
  ) => (
    <svg
      fill={fill}
      height={height}
      viewBox={viewBox}
      width={width}
      xmlns={xmlns}
      {...rest}
      ref={ref}
    >
      <rect
        x="2.436"
        y="12.404"
        width="59.151"
        height="43.912"
        rx="3.738"
        ry="3.738"
        transform="translate(-4.815 5.219) rotate(-8.672)"
      />
      <path d="M16.06,12.473c-.287,0-.578-.062-.854-.193-.998-.473-1.424-1.665-.952-2.664C16.898,4.031,22.21.452,28.117.276c6.649-.176,10.977,4.026,12.147,5.325.74.82.674,2.085-.146,2.824-.82.74-2.086.674-2.824-.146-.627-.695-4.047-4.146-9.058-4.005-4.397.131-8.37,2.833-10.368,7.054-.342.722-1.06,1.145-1.809,1.145Z" />
    </svg>
  ),
);
NavCompaniesIcon.displayName = "NavCompaniesIcon";

export default NavCompaniesIcon;
