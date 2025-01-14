import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Preview1 from './views/Preview1';
import AddRooms from './views/AddRooms';
import ViewRooms from './views/ViewRooms';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/preview" element={<Preview1 />} />
            <Route path="/rooms/add" element={<AddRooms />} />
            <Route path="/rooms/view" element={<ViewRooms />} />
            {/* Other routes */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
