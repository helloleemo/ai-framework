import { JSX } from 'react';

export type Selections = {
  name: string;
  icon: JSX.Element | string;
  ui?: string;
  type?: string; // input, transform, output
  menu?: {
    name?: string;
    children?: any;
  };
};
