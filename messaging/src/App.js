import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import Sources from './Sources/SourcesContainer.js';
import SourceDetail from './Source/SourceDetailContainer.js';
import Messages from './Messages/MessagesContainer';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Messaging</h1>
        <Link to="/">Home</Link>
        <Route path="/" exact component={Sources} />
        <Route
          path="/source/:sourceId"
          exact
          render={props => (
            <SourceDetail sourceId={props.match.params.sourceId} />
          )}
        />
        <Route
          path="/source/:sourceId/messages"
          exact
          render={props => (
            <Messages sourceId={props.match.params.sourceId} page={2} />
          )}
        />
        <Route
          path="/source/:sourceId/messages/:status"
          render={props => (
            <Messages
              sourceId={props.match.params.sourceId}
              status={props.match.params.status}
            />
          )}
        />
      </div>
    </Router>
  );
}

export default App;
