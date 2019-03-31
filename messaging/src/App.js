import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Sources from './Sources/SourcesContainer.js';
import SourceDetail from './Source/SourceDetailContainer.js';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Messaging</h1>
        <Route path="/" exact component={Sources} />
        <Route
          path="/source/:sourceId"
          exact
          render={props => (
            <SourceDetail sourceId={props.match.params.sourceId} />
          )}
        />
      </div>
    </Router>
  );
}

export default App;
