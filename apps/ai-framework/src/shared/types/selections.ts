import { JSX } from 'react';

// export type Selections = {
//   success: boolean;
//   name: string;
//   icon: JSX.Element | string;
//   ui?: string;
//   type?: string; // input, transform, output
//   menu?: {
//     name?: string;
//     children?: any;
//   };
// };

export interface SelectionChild {
  name: string;
  icon: JSX.Element | string | null;
  children: SelectionChild[] | null;
}

export interface SelectionData {
  name: string;
  icon: JSX.Element | string | null;
  children: SelectionChild[] | null;
}

export interface SelectionsFromAPI {
  success: boolean;
  message: string;
  statusCode: string;
  data: SelectionData[];
}
