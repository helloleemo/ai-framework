import { SVGProps } from 'react';

export function CableIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.2em"
      height="1.2em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Iconoir by Luca Burgio - https://github.com/iconoir-icons/iconoir/blob/main/LICENSE */}
      <g fill="none" stroke="#525252" strokeWidth="1.5">
        <path d="M2 15V9a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6Z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.667 8L10 12h4l-1.667 4"
        />
      </g>
    </svg>
  );
}
