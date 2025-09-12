import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { deleteDagAPI, getAllDagsAPI } from '../../api/pipeline';
import { HtmlHTMLAttributes, useEffect, useState } from 'react';
import { EditIcon } from '@/shared/ui/icon/edit-icon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { Button } from '@/shared/ui/button';
import { DetailsIcon } from '@/shared/ui/icon/details-icon';
import { DeleteIcon } from '@/shared/ui/icon/delete-icon';
import { MoreIcon } from '@/shared/ui/icon/more-icon';
import { useNavigate } from 'react-router-dom';
import { useToaster } from '@/shared/hooks/use-toaster';
import DialogOpen from '@/shared/components/dialog/dialog';
import { PaginationContainer } from './pagination';
import { Skeleton } from '@/shared/ui/skeleton';

function ViewAllElement() {
  const [allData, setAllData] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDag, setSelectedDag] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const navigate = useNavigate();
  const { showSuccess, showError } = useToaster();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllDagsAPI();
      console.log('res', res);
      if (res.success && res.data) {
        setAllData(res.data);
        setLoading(false);
        showSuccess('資料載入成功');
      } else {
        setAllData([]);
        setLoading(false);
        showError('沒有資料');
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
      showError('獲取資料失敗: ' + error);
    }
  };

  const deleteDag = async (dagId: string) => {
    const confirmDelete = window.confirm(`確定要刪除？此動作不能復原`);
    if (confirmDelete) {
      try {
        const res = await deleteDagAPI(dagId);
        if (res.success) {
          showSuccess('刪除成功');
          fetchData();
        } else {
          showError('刪除失敗: ' + res.message);
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allData.slice(startIndex, endIndex);
  };
  const currentPageData = getCurrentPageData();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [allData]);

  // handlers
  const handleActions = (dag: any, action: string) => {
    switch (action) {
      case 'edit':
        console.log('edit', dag);
        navigate(`/ai-framework/artboard/${dag.dag_id}`);
        break;
      case 'delete':
        deleteDag(dag.dag_id);
        break;
      case 'details':
        setShowDialog(true);
        setSelectedDag(dag);
        break;
    }
  };

  // ui
  const actions = [
    {
      name: 'edit',
      action: 'edit',
      tooltip: '編輯',
      icon: <EditIcon className="h-5 w-5" />,
    },
    {
      name: 'details',
      action: 'details',
      tooltip: '詳情',
      icon: <DetailsIcon className="h-5 w-5" />,
    },
    {
      name: 'delete',
      action: 'delete',
      tooltip: '刪除',
      icon: <DeleteIcon className="h-5 w-5" />,
    },
    {
      name: 'more',
      action: 'more',
      // tooltip: '',
      icon: <MoreIcon className="h-5 w-5" />,
    },
  ];
  const intervalItem = [
    { value: '@once', label: '只執行一次' },
    { value: '*/10 * * * *', label: '每十分鐘執行一次' },
    { value: '59 * * * *', label: '每小時尾端執行一次' },
    { value: '0 6 * * *', label: '每天早上6點執行一次' },
    { value: '0 0 * * *', label: '每天半夜12點執行一次' },
  ];

  const handleDialogConfirm = () => {
    setShowDialog(false);
  };

  const handleDialogCancel = () => {
    console.log('取消');
    setShowDialog(false);
  };

  const tableRenderActions = (dag: any) => {
    const tableColumn = actions.map((action, idx) => {
      const isDisabled = dag.state !== 'failed' && dag.state !== 'success';

      let buttonClasses = `icon rounded-sm p-1 `;
      if (isDisabled) {
        if (action.action === 'more') {
          buttonClasses += 'cursor-pointer text-gray-500 hover:bg-neutral-200';
        } else {
          buttonClasses += 'text-gray-300 cursor-default opacity-70';
        }
      } else {
        buttonClasses += `cursor-pointer text-gray-500 hover:bg-neutral-200 ${
          action.action === 'delete'
            ? 'hover:text-red-500'
            : 'hover:text-blue-500'
        }`;
      }
      return (
        <Tooltip key={idx}>
          <TooltipTrigger asChild>
            <div
              className={buttonClasses}
              onClick={() => {
                if (isDisabled) {
                  return;
                }
                handleActions(dag, action.action);
              }}
            >
              {action.icon}
            </div>
          </TooltipTrigger>
          {action.tooltip && (
            <TooltipContent className="rounded-md bg-gray-800 p-2 text-white shadow-lg">
              <p className="text-xs">{action.tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      );
    });
    return tableColumn;
  };

  const tableRenderState = (state: string) => {
    switch (state) {
      case 'failed':
        return <div className="h-3 w-3 rounded-full bg-red-500"></div>;
      case 'success':
        return <div className="h-3 w-3 rounded-full bg-green-500"></div>;
      default:
        return <div className="h-3 w-3 rounded-full bg-neutral-500"></div>;
    }
  };

  const tableRenderCatchup = (catchup: boolean) => {
    if (catchup) {
      return (
        <div className="w-fit rounded-full bg-amber-500 px-2 py-1">
          <p className="text-xs text-white">Running</p>
        </div>
      );
    } else {
      return (
        <div className="w-fit rounded-full bg-neutral-200 px-2 py-1">
          <p className="text-xs text-neutral-500">Default</p>
        </div>
      );
    }
  };

  const tableRenderSchedule = (schedule: string) => {
    const item = intervalItem.find((item) => item.value === schedule);
    return item ? item.label : schedule;
  };

  return (
    <div className="h-full overflow-auto bg-white p-5">
      <div className="title">
        <h2 className="text-xl font-bold text-neutral-800">
          All Data Pipelines
        </h2>
        <p className="text-md mt-1 mb-2 text-neutral-500">
          View and manage all your data pipelines in one place.
        </p>
      </div>
      <div className="table-container h-[calc(100%-250px)] w-full overflow-auto border border-sky-500">
        {/* Loading */}
        {loading &&
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
            return (
              <div className="mb-5 flex flex-col" key={item + index}>
                <Skeleton className="h-[35px] w-full rounded-sm" />
              </div>
            );
          })}
        {/* Table */}
        {!loading && (
          <Table>
            {/* <TableCaption>Data pipeline</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="">ID</TableHead>
                <TableHead>執行頻率</TableHead>
                <TableHead>開始日期</TableHead>
                <TableHead>使用者</TableHead>
                <TableHead className="text-center">Catchup</TableHead>
                <TableHead className="text-center">State</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.map((dag, index) => {
                const globalIndex = (currentPage - 1) * pageSize + index + 1;
                return (
                  <TableRow key={dag.dag_id || index}>
                    <TableCell className="min-w-[50px]">
                      {globalIndex}
                    </TableCell>
                    <TableCell className="min-w-[150px] text-sm break-all">
                      {dag.dag_id}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      {tableRenderSchedule(dag.schedule_interval)}
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {dag.start_date}
                    </TableCell>
                    <TableCell className="min-w-[80px]">{dag.owner}</TableCell>
                    <TableCell className="min-w-[100px] text-center">
                      <div className="flex h-full items-center justify-center">
                        {tableRenderCatchup(dag.catchup)}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[80px] text-center">
                      <div className="flex h-full items-center justify-center">
                        {tableRenderState(dag.state)}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px] text-center">
                      <div className="flex items-center justify-center gap-1">
                        {tableRenderActions(dag)}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
      {/* Pagination  */}
      <div className="flex-shrink-0">
        <PaginationContainer
          totalItems={allData.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      {showDialog && (
        <DialogOpen
          // trigger={null}
          title="詳細資料"
          description="DAG 詳細資料"
          data={selectedDag}
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
        />
      )}
    </div>
  );
}

export default function ViewAll() {
  return (
    <TooltipProvider>
      <ViewAllElement />
    </TooltipProvider>
  );
}
