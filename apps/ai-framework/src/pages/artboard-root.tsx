// import { DnDProvider } from '@/components/test-dnd-contest';
import { useMenu } from '@/hooks/menu-toggle';
import { Outlet } from 'react-router-dom';

export default function ArtboardRoot() {
  const { menuToggle } = useMenu();

  return (
    <div
      className=" flex  flex-col justify-center items-center gap-y-5 border border-red-500"
      style={{
        width: menuToggle ? 'calc(100vw - 15px)' : 'calc(100vw - 335px)',
        height: 'calc(100vh - 60px)',
      }}
    >
      <Outlet />
    </div>
  );
}
