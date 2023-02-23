import { BrowserRouter, Routes, Route} from 'react-router-dom';
import JsonData from './components/JsonData';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<JsonData></JsonData>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
