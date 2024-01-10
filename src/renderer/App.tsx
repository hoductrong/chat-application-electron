import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ChatWindow from './routes/ChatWindow';
import AuthenticateWindow from './routes/AuthenticateWindow';
import { observer } from 'mobx-react-lite';

const App = observer(function () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatWindow />} />
        <Route path="/login" element={<AuthenticateWindow />} />
      </Routes>
    </Router>
  );
});

export default App;
