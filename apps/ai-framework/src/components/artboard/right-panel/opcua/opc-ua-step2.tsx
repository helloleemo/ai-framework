import { DashboardIcon } from '@/shared/ui/icon/dashboard-icon';
import { Button } from '@/shared/ui/button';
import { Label } from '@radix-ui/react-label';
import { InfoIcon } from '@/shared/ui/icon/info-icon';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/shared/ui/tooltip';
import { CloseIcon } from '@/shared/ui/icon/close-icon';

type Step2Props = {
  activeNode: { data: { label: string } };
  form2: { tags: string[] };
  setForm2: React.Dispatch<React.SetStateAction<{ tags: string[] }>>;
  tagsData: any[];
  renderNode: (tag: any) => React.ReactNode;
  onSetProperties: () => void;
};

export default function OpcUaStep2({
  activeNode,
  form2,
  setForm2,
  tagsData,
  renderNode,
  onSetProperties,
}: Step2Props) {
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
      <div className="info h-[calc(100vh-250px)] flex-col overflow-y-auto border border-yellow-500">
        <p className="text-sm font-bold text-neutral-800">Tag settings</p>
        <div className="grid w-full max-w-sm items-center gap-1 pt-2">
          <div className="flex items-center gap-2 pt-2">
            <Label className="text-sm" htmlFor="tags">
              Selected Tags
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="inline-block h-4 w-4 text-neutral-500" />
                </TooltipTrigger>
                <TooltipContent data-side="right">
                  At least one tag must be selected.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex h-full flex-wrap">
            {form2.tags.map((tag) => (
              <span
                key={tag}
                className="text-text-neutral-500 mr-1 mb-1 flex w-fit items-center rounded bg-neutral-100 px-2 py-1 text-xs break-all"
              >
                {tag}
                <button
                  className="ml-1 cursor-pointer text-neutral-500 hover:text-neutral-900"
                  onClick={() =>
                    setForm2((prev) => ({
                      ...prev,
                      tags: prev.tags.filter((t) => t !== tag),
                    }))
                  }
                  type="button"
                  tabIndex={-1}
                >
                  <CloseIcon className="h-4 w-4 hover:h-5 hover:w-5" />
                </button>
              </span>
            ))}
          </div>
          <div className="scroller-fade h-[calc(100vh-350px)] overflow-y-auto">
            {tagsData.map(renderNode)}
          </div>
        </div>
      </div>
      <Button
        onClick={onSetProperties}
        variant={'default'}
        className="mt-4 w-full"
      >
        <p className="text-sm">Set properties</p>
      </Button>
    </>
  );
}
