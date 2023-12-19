import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactReactive } from 'src/reactive';
import './App.css';
import ChatWindow from './components/ChatWindow';

export default function App() {
  return (
    <ReactReactive>
      <Router>
        <Routes>
          <Route path="/" element={<ChatWindow />} />
        </Routes>
      </Router>
    </ReactReactive>
  );
}
