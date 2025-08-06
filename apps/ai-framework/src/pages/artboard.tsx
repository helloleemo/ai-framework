import { PipeIcon } from '@/components/icon/pipe-icon';
import { PipeLineIcon2 } from '@/components/icon/pipeline-icon-2';
import { useMenu } from '@/hooks/menu-toggle';
import { Outlet } from 'react-router-dom';

export default function Artboard() {
  const { menuToggle } = useMenu();
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
    // icon

    // menu
    <div
      className="border border-red-500 flex flex-col justify-center items-center gap-y-5"
      style={{
        width: menuToggle ? 'calc(100vw - 35px)' : 'calc(100vw - 350px)',
        height: 'calc(100vh - 75px)',
      }}
    >
      <Outlet />
    </div>
  );
}
