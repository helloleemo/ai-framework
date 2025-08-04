import { JSX } from 'react';

export type Selections = {
  name: string;
  icon: JSX.Element | string;
  ui?: string;
  menu?: {
    name?: string;
    children?: any;
  };
};
