import { Button } from '@material-ui/core';
import React from 'react';
import { useStateValue } from '../context/StateProvider';
import { auth, provider } from '../firebase/config';

import '../styles/Login.css';

function Login() {
  const [{}, dispach] = useStateValue();
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispach({
          type: 'SET_USER',
          user: result.user,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };
  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt=""
        />
        <div className="login_text">
          <h1>Sign in to Whatsapp</h1>
        </div>
        <Button type="submit" onClick={signIn}>
          Sign in With Google
        </Button>
      </div>
    </div>
  );
}
export default Login;
