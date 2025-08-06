import { PipeIcon } from '@/components/icon/pipe-icon';
import { PipeLineIcon2 } from '@/components/icon/pipeline-icon-2';

export default function Menu() {
  const menus = [
    {
      name: '建立新畫布',
      description: '從空畫布開始新建Pipeline。',
      icon: <PipeIcon />,
      linkTo: '/artboard/new',
    },
    {
      name: '從範本建立',
      description: '從範本建立新的Pipeline。',
      icon: <PipeLineIcon2 />,
      linkTo: '/artboard/template',
    },
  ];

  return (
    <>
      {menus.map((menuItem, index) => {
        return (
          <div
            key={index}
            className="cursor-pointer hover:bg-neutral-50 border w-[380px] bg-white rounded-lg border-neutral-200 px-10 py-5 flex items-center gap-3"
          >
            <div className="icon">{menuItem.icon}</div>
            <div className="word">
              <p className="text-lg">{menuItem.name}</p>
              <p className="text-base text-neutral-500">
                {menuItem.description}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
}
