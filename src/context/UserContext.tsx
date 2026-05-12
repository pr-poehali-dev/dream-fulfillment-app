import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface VKUser {
  id: number;
  vk_id: number;
  name: string;
  avatar_url: string;
}

interface UserContextValue {
  user: VKUser | null;
  login: (user: VKUser) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VKUser | null>(() => {
    try {
      const raw = localStorage.getItem('vk_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = (u: VKUser) => {
    setUser(u);
    localStorage.setItem('vk_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vk_user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
