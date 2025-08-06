import { useMenu } from '@/hooks/menu-toggle';
import { Outlet } from 'react-router-dom';

export default function ArtboardRoot() {
  const { menuToggle } = useMenu();

  return (
    <div
      className=" flex  flex-col justify-center items-center gap-y-5"
      style={{
        width: menuToggle ? 'calc(100vw - 35px)' : 'calc(100vw - 340px)',
        height: 'calc(100vh - 70px)',
      }}
    >
      <Outlet />
    </div>
  );
}
