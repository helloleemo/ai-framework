import { CloseIcon } from '@/shared/ui/icon/close-icon';

export default function TopTab() {
  return (
    <div className="ml-5">
      <div className="w-fit rounded-t-md bg-white py-2 pr-4 pl-5">
        <div className="activeFile flex items-center gap-x-2">
          <div className="unSaved h-2.5 w-2.5 rounded-full bg-sky-500"></div>
          <div className="text">
            <p className="text-sm text-neutral-600">2025-08-06 - Draft</p>
          </div>
          <div className="icon cursor-pointer rounded-full p-1 hover:bg-neutral-100">
            <CloseIcon className="fill-neutral-800" size="1.3em" />
          </div>
        </div>
        <div className="others"></div>
      </div>
    </div>
  );
}
