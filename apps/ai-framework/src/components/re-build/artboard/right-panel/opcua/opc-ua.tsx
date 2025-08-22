import { useState } from 'react';
import Step1 from './opc-ua-step1';
import Step2 from './opc-ua-step2';
import Step3 from './opc-ua-step3';
import { DashboardIcon } from '@/components/icon/dashboard-icon';

export default function OPCUA({
  activeNode,
  onSubmit,
}: {
  activeNode: any;
  onSubmit?: (id: any, data: any) => void;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    connectionString: '',
    account: '',
    password: '',
  });
  const [form2, setForm2] = useState({ duration: '', tags: [] as string[] });
  const [form3, setForm3] = useState({
    startDate: undefined,
    endDate: undefined,
  });

  // 最後一步提交
  const handleSubmit = () => {
    const allData = { ...form, ...form2, ...form3 };
    if (onSubmit) onSubmit(activeNode.id, allData);
  };

  return (
    <div>
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
      <div className="info h-[calc(100vh-185px)] flex-col overflow-y-auto border border-yellow-500">
        {step === 1 && (
          <Step1
            activeNode={activeNode}
            form={form}
            setForm={setForm}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2
            activeNode={activeNode}
            form2={form2}
            setForm2={setForm2}
            onNext={() => setStep(3)}
            onPrev={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3
            activeNode={activeNode}
            form3={form3}
            setForm3={setForm3}
            onPrev={() => setStep(2)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
