
import Nav from './Components/Nav.jsx';
import Foter from './Components/Foter.jsx';
import Recipes from './Components/Recipes.jsx';

function App() {
  return (
    <main className="dark:bg-gray-800 dark:text-white minHeight100 loading">
     <Nav />
     <Recipes />
     <Foter />
    </main>
  );
}

export default App;
