import React from 'react';
import { useView } from './hooks';

function LogOut() {
  const [_view, setView] = useView();
  React.useEffect(() => {
    localStorage.clear();
    setView('authorize');
  }, []);

  return <>Logging out...</>;
}

export default LogOut;
