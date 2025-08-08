import { createContext, useContext, useState, ReactNode } from 'react';

// 定義類型
interface DnDContextType {
  type: string | null;
  setType: (type: string | null) => void;
}

// Context
const DnDContext = createContext<DnDContextType | undefined>(undefined);

// Provider
interface DnDProviderProps {
  children: ReactNode;
}

export const DnDProvider = ({ children }: DnDProviderProps) => {
  const [type, setType] = useState<string | null>(null);

  return (
    <DnDContext.Provider value={{ type, setType }}>
      {children}
    </DnDContext.Provider>
  );
};

// Hook
export const useDnD = (): DnDContextType => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error('useDnD must be used within a DnDProvider');
  }
  return context;
};

export default DnDContext;
