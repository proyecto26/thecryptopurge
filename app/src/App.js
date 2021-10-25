import {
  Redirect,
  Route,
  Switch,
  HashRouter as Router
} from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home" component={Home} exact />
        <Route path="/game" component={Game} exact />
        <Route path="/" render={() => <Redirect to="/home" />} exact />
      </Switch>
    </Router>
  );
}

export default App;
