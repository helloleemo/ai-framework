import { getMenuItemsAPI } from '@/api/menu';
import { PipeIcon } from '@/components/icon/pipe-icon';
import { PipeLineIcon2 } from '@/components/icon/pipeline-icon-2';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getDagTemplate } from '@/api/pipeline';

export default function ArtboardMenu() {
  const navigate = useNavigate();
  //
  const [openDialog, setOpenDialog] = useState(false);
  const handleCreateNew = () => {
    setOpenDialog(true);
  };
  const menus = [
    {
      name: '建立新畫布',
      description: '從空畫布開始新建Pipeline。',
      icon: <PipeIcon className="text-sky-500" />,
      linkTo: '/re-build/ai-framework/artboard',
    },
    {
      name: '從範本建立',
      description: '從範本建立新的Pipeline。',
      icon: <PipeLineIcon2 className="text-sky-500" />,
      onClick: handleCreateNew,
    },
  ];

  // 讚入資料
  const handleSelectTemplate = async (templateIndex: number) => {
    try {
      // 載入模板資料
      const res = await getDagTemplate();
      const templateData = res[templateIndex];

      // 將模板資料存到 sessionStorage 或傳遞到下一頁
      sessionStorage.setItem('selectedTemplate', JSON.stringify(templateData));

      // 關閉 dialog 並導向到 artboard-temp
      setOpenDialog(false);
      navigate('/re-build/ai-framework/artboard-temp');
    } catch (error) {
      console.error('載入模板失敗:', error);
    }
  };

  return (
    <>
      <div className="absolute top-1/3 left-3/5 -translate-x-1/2 -translate-y-1/2">
        {menus.map((menuItem, index) => {
          if (menuItem.linkTo) {
            // 有 linkTo 的用 Link
            return (
              <Link to={menuItem.linkTo} key={index} className="mb-5 block">
                <div className="flex w-[380px] cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-white px-10 py-5 hover:bg-neutral-50">
                  <div className="icon">{menuItem.icon}</div>
                  <div className="word">
                    <p className="text-lg">{menuItem.name}</p>
                    <p className="text-base text-neutral-500">
                      {menuItem.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          } else {
            // 沒有 linkTo 的用 onClick
            return (
              <div
                key={index}
                onClick={menuItem.onClick}
                className="mb-5 flex w-[380px] cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-white px-10 py-5 hover:bg-neutral-50"
              >
                <div className="icon">{menuItem.icon}</div>
                <div className="word">
                  <p className="text-lg">{menuItem.name}</p>
                  <p className="text-base text-neutral-500">
                    {menuItem.description}
                  </p>
                </div>
              </div>
            );
          }
        })}
      </div>
      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>請選擇模板</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="canvas-name">模板</Label>
              {/* 模板選擇 */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSelectTemplate(0)}
                  variant="outline"
                  className="w-fit"
                >
                  模板1
                </Button>
                <Button
                  onClick={() => handleSelectTemplate(1)}
                  variant="outline"
                  className="w-fit"
                >
                  模板2
                </Button>
              </div>
            </div>
          </div>
          <div className="my-5 border-b border-b-neutral-200"></div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            {/* <Button
              type="submit"
              onClick={() => {
                // 這裡可以處理建立邏輯
                setOpenDialog(false);
                // 導向到 artboard
                window.location.href = '/re-build/ai-framework/artboard';
              }}
            >
              建立
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
