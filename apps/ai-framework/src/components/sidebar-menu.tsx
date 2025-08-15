import { getMenuItemsAPI } from '@/api/menu';
import { PipeIcon } from '@/components/icon/pipe-icon';
import { PipeLineIcon2 } from '@/components/icon/pipeline-icon-2';
import { Link } from 'react-router-dom';

export default function Menu() {
  const menus = [
    {
      name: '建立新畫布',
      description: '從空畫布開始新建Pipeline。',
      icon: <PipeIcon />,
      linkTo: 'new',
    },
    {
      name: '從範本建立',
      description: '從範本建立新的Pipeline。',
      icon: <PipeLineIcon2 />,
      linkTo: '/artboard/template',
    },
  ];

  getMenuItemsAPI().then((res) => {
    if (!res) return;
    if (res.success) {
      console.log('Menu items fetched:', res);
    }
  });

  return (
    <>
      {menus.map((menuItem, index) => {
        return (
          <Link to={menuItem.linkTo} key={index}>
            <div
              key={index}
              className="flex w-[380px] cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-white px-10 py-5 hover:bg-neutral-50"
            >
              <div className="icon">{menuItem.icon}</div>
              <div className="word">
                <p className="text-lg">{menuItem.name}</p>
                <p className="text-base text-neutral-500">
                  {menuItem.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
}
