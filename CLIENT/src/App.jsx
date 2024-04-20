import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CvesList } from './components/CvesList';
import { Home } from './components/Home';
import CveData from './components/CveData'; 

function App() {
  return (
    <Router>
      <div className='w-100 vh-100 d-flex justify-content-center'>
        <div>
          <Routes>
            <Route path='/cves/list' element={<CvesList />} />
            <Route path='/' element={<Home />} />
            <Route path="/cveslist/:id" element={<CveData />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
