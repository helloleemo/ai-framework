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
import { useEditMode } from './artboard';
import { useNavigate } from 'react-router-dom';

export function GetTempDialog() {
  const { createSpinner } = useSpinner();
  const { showSuccess, showError } = useToaster();
  const { loadFromAPIResponse, loadFromDAG, clearCanvas } = usePipeline();
  const [index, setIndex] = useState(0);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isEditMode } = useEditMode();
  const navigate = useNavigate();

  const handleGetTemp = async () => {
    try {
      const res = await getDagTemplateAPI();
      if (res.success) {
        showSuccess('模板載入成功');
        console.log('Get Dag data successfully:', res);
        if (res.data.length === 0 || !res.data) {
          showError('沒有找到模板');
          setTemplates([]);
        } else {
          setTemplates(res.data);
        }
      }
    } catch (error) {
      console.error('Error getting Dag data:', error);
      showError('獲取模板失敗: ' + error);
      setTemplates([]);
    }
  };

  // 創建空白畫布
  const handleCreateBlank = () => {
    const hasContent = true;

    if (hasContent) {
      const confirmClear = window.confirm(
        '目前畫布上的內容將會被清空，確定要建立新畫布嗎？',
      );
      if (!confirmClear) return;
    }

    if (isEditMode) {
      navigate('/ai-framework/artboard');
    } else {
      clearCanvas();
    }
    setIsDialogOpen(false);
    showSuccess('新畫布已建立！');
  };

  // 從模板創建
  const renderTemplate = (index: number) => {
    if (templates.length === 0) {
      showError('請先選擇模板');
      return;
    }

    const hasContent = true;

    if (hasContent) {
      const confirmClear = window.confirm(
        '目前畫布上的內容將會被清空，確定要使用模板建立新畫布嗎？',
      );
      if (!confirmClear) return;
    }

    try {
      navigate('/ai-framework/artboard');
      loadFromDAG(templates[index]);
      setIsDialogOpen(false);
      showSuccess('從模板建立成功！');
    } catch (error) {
      showError('從模板建立失敗: ' + error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleGetTemp} variant="outline">
          <TemplateIcon className={`h-5 w-5 text-neutral-600`} />
          Create
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>建立新 Pipeline</DialogTitle>
          <DialogDescription>
            請選擇要建立空白畫布或從現有模板開始
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* 空白畫布選項 */}
          <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
            <div>
              <h3 className="font-medium">空白畫布</h3>
              <p className="text-sm text-gray-500">從頭開始建立新的 Pipeline</p>
            </div>
            <Button onClick={handleCreateBlank} variant="outline">
              建立空白畫布
            </Button>
          </div>

          {/* 模板選項 */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 font-medium">從模板建立</h3>
            <p className="mb-4 text-sm text-gray-500">選擇現有模板快速開始</p>

            <div className="grid gap-3">
              {/* <Label className="text-sm" htmlFor="template-select">
                請選擇模板
              </Label> */}

              {templates.length > 0 ? (
                <div className="space-y-3">
                  <Select
                    value={index.toString()}
                    onValueChange={(value) => setIndex(Number(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="選擇模板" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>可用模板</SelectLabel>
                        {templates.map((template, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>
                            {template.dag_id}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => renderTemplate(index)}
                    className="w-full"
                    disabled={templates.length === 0}
                  >
                    從模板建立
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center py-4">
                  {createSpinner({ size: 'sm', color: 'blue' })}
                  <span className="ml-2 text-sm text-gray-500">
                    載入模板中...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            {/* <Button variant="outline">取消</Button> */}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
