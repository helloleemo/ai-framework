import { SVGProps } from 'react';

export function TemplateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={props.className}
      {...props}
    >
      {/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="18" height="7" x="3" y="3" rx="1" />
        <rect width="9" height="7" x="3" y="14" rx="1" />
        <rect width="5" height="7" x="16" y="14" rx="1" />
      </g>
    </svg>
  );
}
