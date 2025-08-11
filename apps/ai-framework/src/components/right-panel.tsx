import { DashboardIcon } from './icon/dashboard-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formContent = [
  {
    label: 'Server',
    name: 'server',
    required: true,
    type: 'select',
  },
  {
    label: '別名',
    name: '別名',
    required: true,
    type: 'text',
  },
  {
    label: '字串',
    name: '字串',
    required: true,
    type: 'text',
  },
  {
    label: '帳號',
    name: '帳號',
    required: true,
    type: 'text',
  },
  {
    label: '密碼',
    name: '密碼',
    required: true,
    type: 'password',
  },
  {
    label: 'Port',
    name: 'port',
    type: 'number',
  },
];

interface NodeData {
  label: string;
  [key: string]: any;
}

interface RightPanelProps {
  node: {
    data: NodeData;
    [key: string]: any;
  };
}

export default function RightPanel({ node }: RightPanelProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="title flex items-center justify-start gap-3 mb-2">
        <div className="icon border-2 border-sky-500 rounded-md w-fit p-[3px]">
          <DashboardIcon className="w-5 h-5 text-sky-500" />
        </div>
        <p className="text-xl font-bold">{node.data.label}</p>
      </div>
      <p className="text-gray-600 mb-4">
        This is the right panel where you can add additional controls or
        information.
      </p>
      <div className="border-b border-gray-200 mb-4"></div>
      {/* Info */}
      <div className="info border border-yellow-500 ">
        <p className="text-neutral-800 font-bold">Basic information</p>

        <div className="w-full max-h-[calc(100vh-280px)] pb-[50px] overflow-y-auto scroller-fade">
          {formContent.map((item, index) => {
            return (
              <div
                key={item.name}
                className="grid w-full max-w-sm items-center gap-3 pt-2"
              >
                <Label
                  htmlFor={item.name}
                  id={index.toString()}
                  className="pb-0 font-normal"
                >
                  {item.label}
                  {item.required && '*'}
                </Label>
                <Input
                  type={item.type}
                  id={item.name}
                  placeholder={item.label}
                  required
                  className="shadow-none"
                />
              </div>
            );
          })}
        </div>
        <Button variant={'outline'} className="w-full mt-4">
          Submit
        </Button>
      </div>
    </>
  );
}
