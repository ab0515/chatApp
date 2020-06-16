import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup.js';
import Login from './pages/Login';
import Chat from './components/Chat';

import { auth } from './services/firebase';
import { CircularProgress } from '@material-ui/core';

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route 
      {...rest}
      render={props => 
        authenticated === true ? <Component {...props} />
          : ( 
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          )}
    />
  );
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  console.log('Auth: ' + authenticated);
  return (
    <Route
      {...rest}
      render={props => 
        authenticated === false ? <Component {...props} /> 
        : <Redirect to={{pahtname: '/chat'}} />
      }
    />
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const progress = {
    position: 'absolute',
    left: '50%',
    top: '35%'
  };

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      console.log(user);
      if (user) { // logged in 
        console.log('logged in');
        setAuthenticated(true);
        setLoading(false);
      } else {
        console.log('not logged in');
        setAuthenticated(false);
        setLoading(false);
      }
    })
  }, []);

  return loading ? ( <div><CircularProgress style={progress} /></div> ) : 
   (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <PrivateRoute path="/chat" authenticated={authenticated} component={Chat} />
        <PublicRoute path="/login" authenticated={authenticated} component={Login} />
        <PublicRoute path="/signup" authenticated={authenticated} component={Signup} />
      </Switch>
    </Router>
  );
}

export default App;
