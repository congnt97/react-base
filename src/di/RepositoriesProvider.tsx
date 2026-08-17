import { createContext, useContext, type ReactNode } from 'react';

import type { AuthRepository } from '@/application/repositories/AuthRepository';
import { createAuthRepository } from '@/infrastructure/repositories/createAuthRepository';

export interface RepositoryContainer {
  authRepository: AuthRepository;
}

// eslint-disable-next-line react-refresh/only-export-components
export function createRepositoryContainer(): RepositoryContainer {
  return {
    authRepository: createAuthRepository(),
  };
}

const RepositoriesContext = createContext<RepositoryContainer | undefined>(
  undefined,
);

export function RepositoriesProvider({
  children,
  container,
}: {
  children: ReactNode;
  container: RepositoryContainer;
}) {
  return (
    <RepositoriesContext.Provider value={container}>
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
