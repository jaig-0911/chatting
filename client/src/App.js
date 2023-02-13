import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Support from "./pages/Support/Support"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import SupportEngine from "./pages/MessageWindow/MessageWindow";


function App() {
  const { user } = useContext(AuthContext);

  console.log(user)
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <SupportEngine /> : <Register />}
        </Route>
        <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/messenger">
          {!user ? <Redirect to="/" /> : <SupportEngine />}
          </Route>
        <Route path="/support">
          {!user ? <Redirect to="/" /> : <Support />}
        
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
