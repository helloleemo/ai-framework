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

const mockData = {
  success: true,
  message: 'Retrieve successful',
  data: [
    {
      dag_id: 'template_dag_pipeline1',
      schedule_interval: '@once',
      start_date: '2025-06-25',
      catchup: false,
      owner: 'test',
      state: 'success',
    },
    {
      dag_id: 'template_dag_pipeline2',
      schedule_interval: '@once',
      start_date: '2025-06-25',
      catchup: false,
      owner: 'test',
      state: 'success',
    },
    {
      dag_id: 'pipeline_e7d8491b-7401-4b2d-a8e4-03123e692440',
      schedule_interval: '@once',
      start_date: '2025-09-02',
      catchup: false,
      owner: 'd2f92e22-76be-4417-83c0-82cbdb7f7a6e',
      state: 'success',
    },
    {
      dag_id: 'pipeline_c4407250-ff25-418c-b6e4-afe64e8b14bf',
      schedule_interval: '@once',
      start_date: '2025-09-01',
      catchup: false,
      owner: 'd2f92e22-76be-4417-83c0-82cbdb7f7a6e',
      state: 'failed',
    },
    {
      dag_id: 'pipeline_03f50a93-d614-4716-b8b1-f8b777c0750f',
      schedule_interval: '@once',
      start_date: '2025-09-02',
      catchup: false,
      owner: 'f21d95a8-d483-4204-b28d-878c9d1b3dbd',
      state: 'failed',
    },
    {
      dag_id: 'pipeline_ecceaa78-61d4-4350-a0d7-9c2cec4f0106',
      schedule_interval: '@once',
      start_date: '2025-09-02',
      catchup: false,
      owner: 'f21d95a8-d483-4204-b28d-878c9d1b3dbd',
      state: 'failed',
    },
    {
      dag_id: 'pipeline_3c582de2-eb94-4edc-aae8-c33619dc0ebb',
      schedule_interval: '@once',
      start_date: '2025-09-02',
      catchup: false,
      owner: 'unknown',
      state: 'success',
    },
    {
      dag_id: 'pipeline_c788ca94-ebd2-4018-8e8e-5cea7359011b',
      schedule_interval: '@once',
      start_date: '2025-09-02',
      catchup: false,
      owner: 'f21d95a8-d483-4204-b28d-878c9d1b3dbd',
      state: 'success',
    },
    {
      dag_id: 'pipeline_33e3ef29-ce3b-4c0c-b5c9-c0dcb3426265',
      schedule_interval: '0 0 * * *',
      start_date: '2025-09-16',
      catchup: false,
      owner: 'b0396c3a-8bba-44ca-8604-17a4f21fb974',
      state: '',
    },
    {
      dag_id: 'pipeline_5d0e4e5d-a68e-4cc7-8c76-5ebc32927ec4',
      schedule_interval: '@once',
      start_date: '2025-06-25',
      catchup: false,
      owner: 'unknown',
      state: 'failed',
    },
    {
      dag_id: 'pipeline_4c152e5a-a989-4470-9de3-e3f34a3da9c7',
      schedule_interval: '@once',
      start_date: '2025-06-25',
      catchup: false,
      owner: 'unknown',
      state: 'success',
    },
    {
      dag_id: 'pipeline_bad7c7f1-ffd9-4450-b5a3-dd75f5b19387',
      schedule_interval: '@once',
      start_date: '2025-09-02',
      catchup: false,
      owner: 'f21d95a8-d483-4204-b28d-878c9d1b3dbd',
      state: 'success',
    },
    {
      dag_id: 'pipeline_54ca2df8-187d-453f-80da-1c0faa69e9af',
      schedule_interval: '@once',
      start_date: '2025-09-02',
      catchup: false,
      owner: 'b0396c3a-8bba-44ca-8604-17a4f21fb974',
      state: 'success',
    },
    {
      dag_id: 'pipeline_810122b8-6236-4d62-87fa-9f71ec41e360',
      schedule_interval: '@once',
      start_date: '2025-09-02',
      catchup: false,
      owner: 'b0396c3a-8bba-44ca-8604-17a4f21fb974',
      state: 'success',
    },
    {
      dag_id: 'pipeline_6aaf9a2a-1b1b-4710-84e3-7e0139fef571',
      schedule_interval: '@once',
      start_date: '2025-09-02',
      catchup: false,
      owner: 'unknown',
      state: 'success',
    },
    {
      dag_id: 'pipeline_dad9bf66-7ede-487a-b2d2-b1436848bbda',
      schedule_interval: '@once',
      start_date: '2025-06-25',
      catchup: false,
      owner: 'unknown',
      state: 'success',
    },
    {
      dag_id: 'pipeline_8ffa9b42-7d60-4eb9-9cd2-c948691161c3',
      schedule_interval: '@once',
      start_date: '2025-06-25',
      catchup: false,
      owner: 'unknown',
      state: 'success',
    },
    {
      dag_id: 'pipeline_bb69aaff-b6be-403d-b9ae-02d83fc32736',
      schedule_interval: '@once',
      start_date: '2025-09-01',
      catchup: false,
      owner: 'unknown',
      state: 'failed',
    },
    {
      dag_id: 'pipeline_1acb9d50-8b86-4d78-9eff-8f691b26637b',
      schedule_interval: '@once',
      start_date: '2025-06-25',
      catchup: false,
      owner: 'unknown',
      state: 'success',
    },
    {
      dag_id: 'pipeline_d5836613-2c94-414a-be89-3386ee6e6c85',
      schedule_interval: '@once',
      start_date: '2025-06-25',
      catchup: false,
      owner: 'unknown',
      state: 'success',
    },
  ],
};

export default function ViewAll() {
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await getAllDagsAPI();
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    // fetchData();
    setData(mockData.data);
  }, []);

  return (
    <div className="h-full w-full bg-white p-10">
      <div className="table border">
        <Table>
          <TableCaption>Data pipeline</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">ID</TableHead>
              <TableHead>schedule_interval</TableHead>
              <TableHead>start_date</TableHead>
              <TableHead>owner</TableHead>
              <TableHead>catchup</TableHead>
              <TableHead className="text-right">state</TableHead>
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
                  <TableCell>{dag.catchup}?</TableCell>
                  <TableCell className="text-right">{dag.state}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
