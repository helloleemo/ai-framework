// import { CableIcon } from '@/components/icon/cable-icon';
// import { Selections } from '@/types/selections';
// import { ArtboardIcon } from '@/components/icon/artboard-icon';
import { SelectionsFromAPI } from '@/types/selections';
// const selections: Selections[] = [
//   {
//     name: '資料源管理',
//     icon: <CableIcon className="text-slate-800" />,
//     ui: 'left-[5%] w-[40%]',
//     menu: {
//       name: '既有Pipeline',
//     },
//   },
//   {
//     name: '畫布',
//     icon: <ArtboardIcon />,
//     ui: 'left-[60%] w-[35%]',
//     menu: {
//       name: '數據接口',
//       children: [
//         {
//           name: '測試用Input',
//           nodeType: 'input',
//           children: ['Input1', 'Input2', 'Input3'],
//         },
//         {
//           name: '測試用transform',
//           nodeType: 'transform',
//           children: ['transform1', 'transform2', 'transform3'],
//         },
//         {
//           name: '測試用Output',
//           nodeType: 'output',
//           children: ['Output1', 'Output2', 'Output3'],
//         },
//         {
//           name: 'shopfloor',
//           children: ['OPC UA', 'OPC DA', 'Mobus TCP'],
//         },
//         {
//           name: 'IoT',
//           children: [
//             'MQTT (in 訂閱 topic)',
//             {
//               name: 'Https (request) for DAQ',
//               children: ['NIMAX API', 'SKF', 'ADLink'],
//             },
//             'MQTT (Out pub topic)',
//             'Https (response) -> Data API',
//           ],
//         },
//         {
//           name: 'Storge',
//           children: ['ODBC (in)', 'PostgreSQL (Out)', 'MongoDB (Out)'],
//         },
//         {
//           name: 'Transform',
//           children: ['Common', '頻譜 function'],
//         },
//       ],
//     },
//   },
// ];

const selectionFromAPI: SelectionsFromAPI[] = [
  {
    success: true,
    message: 'Success',
    statusCode: 'S000001',
    data: [
      {
        name: '數據接口',
        icon: 'default',
        children: [
          {
            name: 'Shopfloor',
            icon: 'default',
            children: [
              { name: 'OPC UA', icon: 'default', children: null },
              { name: 'OPC DA', icon: 'default', children: null },
              { name: 'Mobus TCP', icon: 'default', children: null },
            ],
          },
          {
            name: 'IoT',
            icon: 'default',
            children: [
              { name: 'MQTT', icon: 'default', children: null },
              {
                name: 'Https (request) for DAQ',
                icon: 'default',
                children: [
                  { name: 'NIMAX API', icon: 'default', children: null },
                  { name: 'SKF', icon: 'default', children: null },
                  { name: 'ADLink', icon: 'default', children: null },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'Storage',
        icon: null,
        children: [
          { name: 'ODBC (in)', icon: 'default', children: null },
          { name: 'PostgreSQL (Out)', icon: 'default', children: null },
          { name: 'MongoDB (Out)', icon: 'default', children: null },
        ],
      },
      {
        name: 'Transform',
        icon: null,
        children: [
          {
            name: 'Common',
            icon: 'default',
            children: null,
          },
          {
            name: '頻譜 function',
            icon: 'default',
            children: null,
          },
        ],
      },
    ],
  },
];

export default selectionFromAPI;
