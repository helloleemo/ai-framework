import { DashboardIcon } from '@/components/icon/dashboard-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

export default function RightPanel({ activeNode }: { activeNode: any }) {
  const [item, setItem] = useState({ label: '', value: '' });
  const handleItemInput = (field: 'label' | 'value', newValue: string) => {
    setItem((prev) => ({ ...prev, [field]: newValue }));
  };

  if (!activeNode) return null;

  console.log('Active node in RightPanel:', activeNode);
  const isOpen = !!activeNode;

  return (
    <div>
      {activeNode && (
        <div>
          <div
            className={`absolute top-0 right-0 bottom-0 z-50 w-[360px] border border-blue-400 bg-white p-5 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} `}
          >
            <div className="title mb-2 flex items-center justify-start gap-3">
              <div className="icon w-fit rounded-md border-2 border-sky-500 p-[3px]">
                <DashboardIcon className="h-5 w-5 text-sky-500" />
              </div>
              <p className="text-lg font-bold">{activeNode.data.label}</p>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatum, illum.
            </p>
            <div className="mb-4 border-b border-gray-200"></div>
            <div className="info h-[calc(100vh-250px)] flex-col overflow-y-auto border border-yellow-500">
              <p className="text-sm font-bold text-neutral-800">
                Basic information
              </p>
              <div className="grid w-full max-w-sm items-center gap-1 pt-2">
                <Label className="text-sm" htmlFor="connection">
                  Connection
                </Label>
                <Input
                  onInput={(e) =>
                    handleItemInput('label', e.currentTarget.value)
                  }
                  type="text"
                  id="connection"
                  placeholder="Connection"
                />
                <Label className="pt-2 text-sm" htmlFor="account">
                  Account
                </Label>
                <Input
                  onInput={(e) =>
                    handleItemInput('value', e.currentTarget.value)
                  }
                  type="text"
                  id="account"
                  placeholder="account"
                />
                <Label className="pt-2 text-sm" htmlFor="password">
                  Password
                </Label>
                <Input
                  onInput={(e) =>
                    handleItemInput('value', e.currentTarget.value)
                  }
                  type="text"
                  id="password"
                  placeholder="password"
                />
              </div>
            </div>
            <Button variant={'default'} className="mt-4 w-full">
              <p className="text-sm">Connect</p>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
