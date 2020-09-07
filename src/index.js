import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom'

// Screen
import Home from './Screen/Home';
import LoginInstagram from './Screen/LoginInstagram';
import ViewInstagram from './Screen/ViewInstagram';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/loginInstagram" component={LoginInstagram} />
      <Route path="/viewInstagram" component={ViewInstagram} />
    </div>
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
