import './App.css';
import Mirror from './Components/Mirror';
import Bars from './Components/Bars';
import Comparison from './Components/Comparison';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Mirror />
        <Bars />
        <Comparison />
      </header>
    </div>
  );
}

export default App;
