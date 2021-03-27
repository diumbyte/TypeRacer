import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import {UserContextProvider} from './UserContext/UserContext';
import GameRoom from './GameRoom/GameRoom';
import AuthComponent from './AuthComponent/AuthComponent';
import Login from './Login/Login';

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={Login}/>
            <Route exact path="/:roomId">
              <AuthComponent>
                <GameRoom />
              </AuthComponent>
            </Route>
          </Switch>
        </Router>
      </UserContextProvider>
    </div>
  );
}

export default App;
