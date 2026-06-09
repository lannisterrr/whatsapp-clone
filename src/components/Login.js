import { useState } from 'react';
import './Login.css';
import { auth, provider } from '../firebase';
import { Button } from '@material-ui/core';

export default function Login({ authError }) {
  const [loginError, setLoginError] = useState(null);
  const [signingIn, setSigningIn] = useState(false);

  const handleLogin = () => {
    console.log('[Login] Sign in with Google clicked');
    setLoginError(null);
    setSigningIn(true);

    // popup works better on localhost than redirect (fewer cookie/domain issues)
    auth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('[Login] signInWithPopup success:', {
          uid: result.user?.uid,
          email: result.user?.email,
        });
      })
      .catch((error) => {
        console.error('[Login] signInWithPopup error:', {
          code: error.code,
          message: error.message,
        });
        setLoginError(`${error.code}: ${error.message}`);
      })
      .finally(() => {
        setSigningIn(false);
      });
  };

  const displayError = loginError || (authError ? `${authError.code}: ${authError.message}` : null);

  return (
    <div className="app">
      <div className="login">
        <div className="login__container">
          <img src="./login-logo.png" alt="logo" />
          <div className="login__text">Sign in to TechChat</div>
          <Button onClick={handleLogin} disabled={signingIn}>
            {signingIn ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          {displayError && (
            <p style={{ color: 'red', marginTop: 12, fontSize: 14, textAlign: 'center' }}>
              {displayError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
