import { DnDProvider } from '../components/test-dnd-contest';
import TestSidebar from '@/components/test-sidebar';
import TestFlow from '../components/test-flow';

import '@xyflow/react/dist/style.css';

export default function TestDnD() {
  return (
    <DnDProvider>
      <div className="h-screen flex">
        <div className="w-64">
          <TestSidebar />
        </div>
        <div className="flex-1">
          <TestFlow />
        </div>
      </div>
    </DnDProvider>
  );
}
