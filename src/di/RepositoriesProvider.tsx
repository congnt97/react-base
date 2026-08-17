import { createContext, useContext, useMemo, type ReactNode } from 'react';

import type { AuthRepository } from '@/application/repositories/AuthRepository';
import { createAuthRepository } from '@/infrastructure/repositories/createAuthRepository';

export interface RepositoryContainer {
  authRepository: AuthRepository;
}

const RepositoriesContext = createContext<RepositoryContainer | undefined>(
  undefined,
);

export function RepositoriesProvider({ children }: { children: ReactNode }) {
  const value = useMemo<RepositoryContainer>(
    () => ({
      authRepository: createAuthRepository(),
    }),
    [],
  );

  return (
    <RepositoriesContext.Provider value={value}>
      {children}
    </RepositoriesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRepository() {
  const context = useContext(RepositoriesContext);
  if (!context) {
    throw new Error('useRepository must be used within a RepositoriesProvider');
  }

  return context;
}
