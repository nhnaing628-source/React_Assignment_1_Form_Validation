import React, { useState, useEffect } from 'react';

import { auth } from "./firebase"; 
import { onAuthStateChanged, signOut } from 'firebase/auth';

import Login from "./component/Login/Login";
import Registration from "./component/Registration/Registration";
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
 
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
        await signOut(auth);
        setIsLoggedIn(false);
    }
  };

  if (initializing) return <div style={{ backgroundColor: '#0b1329', minHeight: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Initializing Workspace...</div>;

  return (
    <div className="App">
      {isLoggedIn ? (
        <Registration onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;