import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import NewProject from './components/NewProject';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewProject />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
