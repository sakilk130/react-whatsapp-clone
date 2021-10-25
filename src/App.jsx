import React from 'react';
import Sidebar from './components/Sidebar';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <div className="app__body">
        {/* Sidebar  */}
        <Sidebar />
        {/* Chat */}
      </div>
    </div>
  );
}

export default App;
