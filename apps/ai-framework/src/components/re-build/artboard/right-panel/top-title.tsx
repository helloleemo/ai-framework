import { DashboardIcon } from '@/components/icon/dashboard-icon';

export default function TopTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <div className="title mb-2 flex items-center justify-start gap-3">
        <div className="icon w-fit rounded-md border-2 border-sky-500 p-[3px]">
          <DashboardIcon className="h-5 w-5 text-sky-500" />
        </div>
        <p className="text-lg font-bold">{title}</p>
      </div>
      <p className="mb-4 text-sm text-gray-600">{description}</p>
    </>
  );
}
