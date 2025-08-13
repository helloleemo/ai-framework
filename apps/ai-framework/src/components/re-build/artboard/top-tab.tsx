import { CloseIcon } from '@/components/icon/close-icon';

export default function TopTab() {
  return (
    <div className="bg-white  rounded-t-md py-2 pl-5 pr-4 w-fit">
      <div className="activeFile flex items-center gap-x-2">
        <div className="unSaved bg-sky-500 rounded-full w-2.5 h-2.5"></div>
        <div className="text">
          <p className="text-sm text-neutral-600">2025-08-06 - Draft</p>
        </div>
        <div className="icon hover:bg-neutral-100 rounded-full p-1 cursor-pointer">
          <CloseIcon className="fill-neutral-800" size="1.3em" />
        </div>
      </div>
      <div className="others"></div>
    </div>
  );
}
