import { DashboardIcon } from '@/components/icon/dashboard-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDownIcon } from 'lucide-react';

type Step3Props = {
  activeNode: any;
  startDateOpen: boolean;
  setStartDateOpen: (open: boolean) => void;
  endDateOpen: boolean;
  setEndDateOpen: (open: boolean) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  onSetProperties: () => void;
};

export default function Step3({
  activeNode,
  startDateOpen,
  setStartDateOpen,
  endDateOpen,
  setEndDateOpen,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onSetProperties,
}: Step3Props) {
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
        <p className="text-sm font-bold text-neutral-800">Data settings</p>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <Label htmlFor="date-picker" className="pt-2 text-sm">
              Start date
            </Label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker"
                  className="w-32 justify-between font-normal"
                >
                  {startDate ? startDate.toLocaleDateString() : 'Select date'}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={startDate ?? undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setStartDate(date ?? null);
                    setStartDateOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col">
            <Label htmlFor="time-picker" className="pt-2 text-sm">
              Time
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="1"
              defaultValue="10:30:00"
              className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
        <div className="mt-2 flex gap-4">
          <div className="flex flex-col">
            <Label htmlFor="end-date-picker" className="pt-2 text-sm">
              End date
            </Label>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="end-date-picker"
                  className="w-32 justify-between font-normal"
                >
                  {endDate ? endDate.toLocaleDateString() : 'Select date'}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={endDate ?? undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setEndDate(date ?? null);
                    setEndDateOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col">
            <Label htmlFor="end-time-picker" className="pt-2 text-sm">
              Time
            </Label>
            <Input
              type="time"
              id="end-time-picker"
              step="1"
              defaultValue="10:30:00"
              className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
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
