import { DashboardIcon } from '@/components/icon/dashboard-icon';

export default function OPCUA({ activeNode }: { activeNode: any }) {
  return (
    <>
      <div className="title mb-2 flex items-center justify-start gap-3">
        <div className="icon w-fit rounded-md border-2 border-sky-500 p-[3px]">
          <DashboardIcon className="h-5 w-5 text-sky-500" />
        </div>
        <p className="text-lg font-bold">{activeNode.data.label}</p>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
        illum.
      </p>
      <div className="mb-4 border-b border-gray-200"></div>
      <div className="info h-[calc(100vh-250px)] flex-col overflow-y-auto border border-yellow-500"></div>
    </>
  );
}
