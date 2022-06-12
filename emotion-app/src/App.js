import './App.css';
import Mirror from './Components/Mirror';
import Bars from './Components/Bars';
import Comparison from './Components/Comparison';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div class="grid-container">
          <div class="grid-item">
            <Mirror />
          </div>
          <div class="grid-item">
            <Bars />
          </div>
          <div class="grid-item">
            <Comparison />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
