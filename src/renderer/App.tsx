import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ChatWindow from './components/ChatWindow';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatWindow />} />
      </Routes>
    </Router>
  );
}
