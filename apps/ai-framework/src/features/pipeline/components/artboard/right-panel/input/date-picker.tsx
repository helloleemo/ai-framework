import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { ChevronDownIcon } from 'lucide-react';

type DatePickerProps = {
  selectedDate: string | null; // 傳進來的日期，必須是 yyyy-mm-dd 格式
  onDateChange: (date: string | null) => void; // 傳出去的日期，格式為 yyyy-mm-dd
};

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，需要 +1
  const day = String(date.getDate()).padStart(2, '0'); // 日期補零

  return `${year}-${month}-${day}`;
}

export default function DatePicker({
  selectedDate,
  onDateChange,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  // 初始化日期
  useEffect(() => {
    if (selectedDate) {
      const parsedDate = new Date(`${selectedDate}T00:00:00`); // 確保是 yyyy-mm-dd 格式
      setDate(parsedDate);
    } else {
      setDate(null);
    }
  }, [selectedDate]);

  // 當日期改變時，傳出格式化的日期
  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    if (newDate) {
      onDateChange(formatDateToYYYYMMDD(newDate)); // 格式化為 yyyy-mm-dd
    } else {
      onDateChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            {date ? formatDateToYYYYMMDD(date) : 'Select date'}{' '}
            {/* 顯示格式化日期 */}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            captionLayout="dropdown"
            onSelect={(newDate) => {
              handleDateChange(newDate ?? null);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
