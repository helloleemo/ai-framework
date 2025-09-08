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
import { getDagTemplateAPI } from '../../api/pipeline';
import { useToaster } from '@/shared/hooks/use-toaster';
import { usePipeline } from '../../hooks/use-context-pipeline';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { useState } from 'react';
import Spinner from '@/shared/ui/spinner';
import { useSpinner } from '@/shared/hooks/use-spinner';
import { TemplateIcon } from '@/shared/ui/icon/template-icon';

export function GetTempDialog() {
  const { createSpinner } = useSpinner();
  const { showSuccess, showError } = useToaster();
  const { loadFromAPIResponse, loadFromDAG } = usePipeline();
  const [index, setIndex] = useState(0);
  const [templates, setTemplates] = useState<any[]>([]);

  const handleGetTemp = async () => {
    try {
      const res = await getDagTemplateAPI();
      if (res.success) {
        showSuccess('Get Dag data successfully');
        console.log('Get Dag data successfully:', res);
        if (res.data.length === 0 || !res.data) {
          showError('No templates found.');
        } else {
          setTemplates(res.data);
        }
      }
    } catch (error) {
      console.error('Error getting Dag data:', error);
      showError('Error getting Dag data: ' + error);
    }
  };
  const renderTemplate = (index: number) => {
    // console.log( templates[index]);
    loadFromDAG(templates[index]);
    showSuccess('建立成功！');
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button onClick={handleGetTemp} variant="outline">
            <TemplateIcon className={`h-5 w-5 text-neutral-600`} />
            Create from template
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create from Template</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim,
              tempora!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label className="text-sm" htmlFor="fs">
                Please select a template
              </Label>
              {templates.length > 0 ? (
                <Select
                  value={index.toString()}
                  onValueChange={(value) => setIndex(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="處理類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>請選擇模板</SelectLabel>
                      {templates.map((_, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          {_.dag_id}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                createSpinner({ size: 'sm', color: 'blue' })
              )}
            </div>
          </div>
          <div className="my-5 border-t"></div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={() => renderTemplate(index)}
                className="data-[state=closed]:animate-fade-out"
              >
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
