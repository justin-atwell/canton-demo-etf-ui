import { useState } from 'react'
import Layout from './components/layout/Layout'
import './App.css'


function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      <div className="text-canton-text">
        <h1 className="text-2xl font-bold">Welcome to Canton ETF Platform</h1>
        <p className="text-canton-muted mt-2">Page: {activePage}</p>
      </div>
    </Layout>
  );
}

export default App;