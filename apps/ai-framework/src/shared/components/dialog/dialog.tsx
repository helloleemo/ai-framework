import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { da } from 'date-fns/locale';
import { useState } from 'react';

export default function DialogOpen({
  title,
  description,
  data,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  data: any;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  const dataDetails = data ? JSON.stringify(data, null, 2) : '';

  return (
    <Dialog open={true} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleConfirm}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="my-2">{dataDetails ?? ''}</div>
          <div className="my-3 w-full border-b"></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
