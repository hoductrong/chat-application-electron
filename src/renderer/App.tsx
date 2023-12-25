import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ChatWindow from './routes/ChatWindow';
import AuthenticateWindow from './routes/AuthenticateWindow';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatWindow />} />
        <Route path="/login" element={<AuthenticateWindow />} />
      </Routes>
    </Router>
  );
}
