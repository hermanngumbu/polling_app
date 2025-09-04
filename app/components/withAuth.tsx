'use client';

import { useEffect, type ComponentType } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const Wrapper = (props: P): JSX.Element | null => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

  return Wrapper;
};

function getDisplayName<P>(WrappedComponent: ComponentType<P>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;
