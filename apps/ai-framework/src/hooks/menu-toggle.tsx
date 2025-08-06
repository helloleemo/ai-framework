import { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextType {
  menuToggle: boolean;
  setMenuToggle: (value: boolean) => void;
  toggleMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider = ({ children }: MenuProviderProps) => {
  const [menuToggle, setMenuToggle] = useState(false);

  const toggleMenu = () => {
    setMenuToggle((prev) => !prev);
    console.log('Menu toooooooggled!!!!', !menuToggle);
  };

  return (
    <MenuContext.Provider value={{ menuToggle, setMenuToggle, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
