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
import { useEffect } from 'react';

export default function ViewAll() {
  const fetchData = async () => {
    try {
      const res = await getAllDagsAPI();
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-full w-full bg-white">
      <div className="table border">
        <Table>
          <TableCaption>Data pipeline</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
