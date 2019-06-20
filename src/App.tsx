import React, {createElement} from 'react';
import logo from './logo.svg';
import './App.css';
import {attemptAutofill} from "./ManualDiMethod/AddressAutofillController";

const App: React.FC = () => {
  return createElement('div', {className: "App"})
  attemptAutofill(action => 'wow DI')({postcode: 'test'})
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
