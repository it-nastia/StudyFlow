import React from "react";import { BrowserRouter as Router, Switch } from "react-router-dom";
import ProtectedRoute from "../../src/components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AuthLayout from "../../src/components/Layout/AuthLayout";

// Public pages
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/AuthPage/Login";
import Register from "./pages/AuthPage/Register";

// Protected pages
import HomePage from "./pages/HomePageHomePage";
import Profile from "./pages/Profile/Profile";
import Schedule from "./pages/Schedule/Schedule";
import Lectures from "./pages/Lectures/Lectures";
import Assignments from "./pages/Assignments/Assignments";

const App = () => {
  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <PublicRoute exact path="/" component={LandingPage} />
        <PublicRoute restricted path="/login" component={Login} />
        <PublicRoute restricted path="/register" component={Register} />

        {/* Protected Routes */}
        <ProtectedRoute path="/home" component={HomePage} />
        <ProtectedRoute path="/profile" component={Profile} />
        <ProtectedRoute path="/schedule" component={Schedule} />
        <ProtectedRoute path="/lectures" component={Lectures} />
        <ProtectedRoute path="/assignments" component={Assignments} />
      </Switch>

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
