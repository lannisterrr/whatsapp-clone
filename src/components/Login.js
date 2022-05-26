import './Login.css';
import { auth, provider } from '../firebase';
import { Button } from '@material-ui/core';

export default function Login() {
  const handleLogin = () => {
    auth.signInWithRedirect(provider);
  };
  return (
    <div className="app">
      <div className="login">
        <div className="login__container">
          <img src="./login-logo.png" alt="logo" />
          <div className="login__text">Sign in to Whatsapp</div>
          <Button onClick={handleLogin}>Sign in with Google</Button>
        </div>
      </div>
    </div>
  );
}
