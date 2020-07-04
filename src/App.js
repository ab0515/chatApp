import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Room from './pages/Room';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Chat from './components/Chat';

import './App.css';

import { auth } from './services/firebase';
import { CircularProgress } from '@material-ui/core';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

import './assets/css/fonts.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#e6ee9c',
      main: '#45046a',
      dark: '#afb42b',
      contrastText: '#fff'
    }
  },
  typography: {
    fontFamily: 
      '"Open Sans',
  }
});

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route 
      {...rest}
      render={props => authenticated === true 
        ? <Component {...props} />
          : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      }
    />
  );
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => authenticated === false 
        ? <Component {...props} /> 
        : <Redirect to='/dashboard' />
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
    auth.onAuthStateChanged(user => {
      if (user) { // logged in 
        console.log('logged in');
        setAuthenticated(true);
        setLoading(false);
      } else {
        console.log('not logged in');
        setAuthenticated(false);
        setLoading(false);
      }
    });
  }, []);

  return loading ? ( <div><CircularProgress style={progress} /></div> ) : 
   (
    <MuiThemeProvider theme={theme}>
      <Router>
        <NavBar authenticated={authenticated} />
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute path="/dashboard" authenticated={authenticated} component={Dashboard} />
          <PrivateRoute path="/room" authenticated={authenticated} component={Room} />
          <PrivateRoute path="/t/:username" authenticated={authenticated} component={Chat} />
          <PublicRoute path="/signup" authenticated={authenticated} component={Signup} />
          <PublicRoute path="/login" authenticated={authenticated} component={Login} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
