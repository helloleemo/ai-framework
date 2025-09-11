import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { getAllDagsAPI } from '../../api/pipeline';
import { useEffect, useState } from 'react';
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

function ViewAllElement() {
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await getAllDagsAPI();
      console.log('res', res);
      setData(res.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // handlers
  const handleActions = (id: string, action: string) => {
    // console.log(`edit ${id} clicked`);
    switch (action) {
      case 'edit':
        handleEdit(id);
    }
  };
  //
  const handleEdit = (id: string) => {
    navigate(`/ai-framework/artboard/${id}`);
  };

  // ui
  const actions = () => ({
    edit: {
      action: 'edit',
      tooltip: 'Edit',
      icon: <EditIcon className="h-5 w-5" />,
    },
    details: {
      action: 'details',
      tooltip: 'Details',
      icon: <DetailsIcon className="h-5 w-5" />,
    },
    delete: {
      action: 'delete',
      tooltip: 'Delete',
      icon: <DeleteIcon className="h-5 w-5" />,
    },
    more: {
      action: 'more',
      tooltip: 'More',
      icon: <MoreIcon className="h-5 w-5" />,
    },
  });
  const objToAry = (obj: object) => {
    return Object.entries(obj).map(([key, value]) => ({ key, ...value }));
  };
  const tableRender = (dag_id: string) => {
    const actionList = objToAry(actions);
    const tableColumn = actionList.map((action, idx) => (
      <>
        <button
          className={`icon cursor-pointer rounded-sm p-1 text-gray-500 hover:bg-neutral-200 ${action.action === 'delete' ? 'hover:text-red-500' : 'hover:text-blue-500'}`}
          key={idx}
          onClick={() => handleActions(dag_id, action.action)}
        >
          {action.icon}
        </button>
        <Tooltip>
          <TooltipTrigger>
            <button
              className={`icon cursor-pointer rounded-sm p-1 text-gray-500 hover:bg-neutral-200 ${action.action === 'delete' ? 'hover:text-red-500' : 'hover:text-blue-500'}`}
              key={idx}
              onClick={() => handleActions(dag_id, action.action)}
            >
              {action.icon}
            </button>
          </TooltipTrigger>
          <TooltipContent className="rounded-md bg-gray-800 p-2 text-white shadow-lg">
            <p className="text-xs">{action.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </>
    ));
    return tableColumn;
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white p-5">
      <div className="title">
        <h2 className="text-2xl font-bold">All Data Pipelines</h2>
        <p className="text-md mt-1 mb-2 text-gray-500">
          View and manage all your data pipelines in one place.
        </p>
      </div>
      <div className="table w-full rounded-md border border-gray-200">
        <Table>
          <TableCaption>Data pipeline</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">ID</TableHead>
              <TableHead>執行頻率</TableHead>
              <TableHead>開始日期</TableHead>
              <TableHead>使用者</TableHead>
              <TableHead className="text-center">Catchup</TableHead>
              <TableHead className="text-center">state</TableHead>
              <TableHead className="text-center">action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((dag, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="text-sm wrap-break-word">
                    {dag.dag_id}
                  </TableCell>
                  <TableCell>{dag.schedule_interval}</TableCell>
                  <TableCell>{dag.start_date}</TableCell>
                  <TableCell>{dag.owner}</TableCell>
                  <TableCell className="text-center">
                    {dag.catchup || 'default'}
                  </TableCell>
                  <TableCell className="text-center">{dag.state}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {tableRender(dag.dag_id)}
                      {/* <button onClick={() => handleActions(dag.dag_id, 'edit')}>
                        Edit
                      </button> */}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
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
