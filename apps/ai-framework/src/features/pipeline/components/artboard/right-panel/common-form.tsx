import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { useSpinner } from '@/shared/hooks/use-spinner';
import { useToaster } from '@/shared/hooks/use-toaster';
import { usePipeline } from '@/features/pipeline/hooks/use-context-pipeline';
import { TopTitle } from './top-title';
import { FormConfig, FormField } from './form-configs';

interface CommonFormProps {
  activeNode: any;
  config: FormConfig;
}

export function CommonForm({ activeNode, config }: CommonFormProps) {
  const { getNode, updateNodeConfig, setActiveNode, setNodeCompleted } =
    usePipeline();
  const { loading, setLoading, Spinner } = useSpinner();
  const { showSuccess } = useToaster();
  const [errorMsg, setErrorMsg] = useState('');

  const node = activeNode ? getNode(activeNode.id) : undefined;

  // 動態建立初始表單狀態
  const createInitialForm = () => {
    const initialForm: any = {};
    config.fields.forEach((field) => {
      switch (field.type) {
        case 'number':
          initialForm[field.name] = 0;
          break;
        case 'text':
          initialForm[field.name] = '';
          break;
        case 'select':
          initialForm[field.name] = field.options?.[0]?.value || '';
          break;
      }
    });
    return initialForm;
  };

  const [form, setForm] = useState(createInitialForm);

  useEffect(() => {
    if (node?.config) {
      const updatedForm = { ...createInitialForm() };
      config.fields.forEach((field) => {
        if (node.config[field.name] !== undefined) {
          updatedForm[field.name] = node.config[field.name];
        }
      });
      setForm(updatedForm);
    } else {
      setForm(createInitialForm());
    }
  }, [activeNode, node]);

  const handleFormChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
    setErrorMsg(''); // 清除錯誤訊息
  };

  const validateForm = () => {
    // 檢查個別欄位驗證
    for (const field of config.fields) {
      if (field.required && !form[field.name]) {
        return `${field.label} 不得為空`;
      }
      if (field.validation) {
        const error = field.validation(form[field.name]);
        if (error) return error;
      }
    }

    // 檢查整體表單驗證
    if (config.validation) {
      const error = config.validation(form);
      if (error) return error;
    }

    return null;
  };

  const handleSubmit = () => {
    setLoading(true);
    setErrorMsg('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      setLoading(false);
      return;
    }

    updateNodeConfig(activeNode.id, form);
    showSuccess('設定成功！');
    setNodeCompleted(activeNode.id, true);
    setLoading(false);
    console.log('form', form);
    setActiveNode(null);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'number':
        return (
          <Input
            type="number"
            id={field.name}
            placeholder={field.placeholder}
            value={form[field.name] === 0 ? '' : form[field.name]}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
          />
        );

      case 'text':
        return (
          <Input
            type="text"
            id={field.name}
            placeholder={field.placeholder}
            value={form[field.name] || ''}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
          />
        );

      case 'select':
        return (
          <Select
            value={form[field.name]}
            onValueChange={(value) => handleFormChange(field.name, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{field.label}</SelectLabel>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <TopTitle title={config.title} description={config.description} />
      <div className="mb-4 h-[calc(100vh-175px)] border border-b border-amber-500">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="form space-y-4">
            <p className="text-sm font-bold text-neutral-800">
              Basic information
            </p>

            {config.fields.map((field) => (
              <div
                key={field.name}
                className="grid w-full max-w-sm items-center gap-1"
              >
                <Label className="text-sm" htmlFor={field.name}>
                  {field.label}
                </Label>
                {renderField(field)}
              </div>
            ))}

            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
          </div>

          <Button
            onClick={handleSubmit}
            variant={'default'}
            className={`mt-4 flex w-full items-center justify-center gap-2 ${loading ? 'cursor-default' : ''}`}
            disabled={loading}
          >
            {loading ? Spinner : '設定'}
          </Button>
        </div>
      </div>
    </>
  );
}
