import { PipeIcon } from '@/components/icon/pipe-icon';
import { useState } from 'react';

export default function Artboard() {
  const [menu, setMenu] = useState([0]);
  const menuSelect = (index: number, menuName: string) => {
    setMenu([index]);
  };

  return (
    <div className="bg-white border rounded-md">
      <div className="border p-5 flex items-center gap-3">
        <div className="icon">
          <PipeIcon />
        </div>
        <div className="word">
          <p>建立新畫布</p>
          <p className="text-sm text-neutral-500">從空畫布開始新建Pipeline。</p>
        </div>
      </div>
    </div>
  );
}
