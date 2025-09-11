import { SVGProps } from 'react';

export function DetailsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={props.className}
      {...props}
    >
      {/* Icon from BoxIcons by Atisa - https://creativecommons.org/licenses/by/4.0/ */}
      <path
        fill="currentColor"
        d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2M4 19V5h16l.002 14z"
      />
      <path fill="currentColor" d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z" />
    </svg>
  );
}
