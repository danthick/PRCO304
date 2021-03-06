import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CookieConsent from "react-cookie-consent";

import Login from "./components/login.component";
import Home from "./components/client/home.component";
import HomePT from "./components/pt/home.component";
import Register from "./components/register.component";
import Workout from "./components/client/workout.component";
import WorkoutPT from "./components/pt/workouts/workout.component";
import Messages from "./components/messages.component";
import Chat from "./components/chat.component";
import Account from "./components/account/account.component";
import BottomNav from  './components/navigation/bottomNavigation.component';
import Body from './components/account/body.component';
import NewWorkout from './components/pt/workouts/newWorkout.component';
import AccountEdit from './components/account/accountEdit.component';
import ChangePassword from './components/account/changePassword.component';
import UserRole from './components/account/userRole.component';
import RecordWorkout from './components/client/recordWorkout.component';
import WorkoutHistory from './components/client/workoutHistory.component';
import ViewWorkoutHistory from './components/client/exerciseHistory.component';
import ClientSchedule from './components/pt/clientSchedule.component';
import ClientDetails from './components/pt/clientDetails.component';
import ClientWorkoutHistory from './components/pt/clientWorkoutHistory.component';

function PrivateRoute ({component: Component, authed, wasInitialised, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : !wasInitialised? ""
        : <Redirect to={{pathname: '/'}} />}
    />
  )
}

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      auth: false,
      ptBool: false,
      wasInitialised: false,
    }
    this.checkAuth()
  }

  async componentDidMount(){
    //await this.checkAuth();
  }

  async checkAuth() {
   await fetch('/api/auth/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
              }
            }
        ).then(async res => {
            await res.json().then(log => {
                if (log.redirect === "/home") {
                  this.setState({
                    auth: true,
                    ptBool: log.ptBool, 
                    wasInitialised: true
                  });
               } else {
                  this.setState({
                    auth: false, 
                    wasInitialised: true
                  });
               }
            });
            }).catch(error => console.log(error))
  }

  render() {
    return (
      <Router>
        <CookieConsent
          location="bottom"
          buttonText="I understand!"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "16px", borderRadius: "5px", padding: "20px"}}
          expires={150} // Number of days
        >This website uses cookies to maintain a users session.{" "}</CookieConsent>

        {this.state.auth? <BottomNav /> : null}

        
        <div className="container" >
          <br/>
          <Route path="/" exact component={Login}/>
          <Route path="/register" exact component={Register}/>
          {this.state.ptBool?
          <Switch>
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/home' component={HomePT} />
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/home/schedule' component={ClientSchedule} />
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/workout' component={WorkoutPT} />
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/workout/new' component={NewWorkout} />
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/home/details' component={ClientDetails} />
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/home/details/history' component={ClientWorkoutHistory} />
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/home/details/history/view' component={ViewWorkoutHistory} />
          </Switch>
          :
          <Switch>
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/home' component={Home} />
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/workout' component={Workout} />
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/workout/record' component={RecordWorkout} />
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/workout/history' component={WorkoutHistory} />
            <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/workout/history/view' component={ViewWorkoutHistory} />
          </Switch>
          }
          
          
          <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/messages' component={Messages} />
          <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/chat' component={Chat} />
          <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/account' component={Account} />
          <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/account/body' component={Body} />
          <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/account/update' component={AccountEdit} />
          <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/account/password' component={ChangePassword} />
          <PrivateRoute authed={this.state.auth} wasInitialised={this.state.wasInitialised} exact path='/account/role' component={UserRole} />
          {/* <Route render={() => <Redirect to="/home" />} /> Used to catch all routes */}
        </div>
      </Router>
    );
  }
}
export default App;