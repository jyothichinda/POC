import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Login = lazy(() => import("auth/Login")); // Import Login from micro-frontend-auth
const AdminConfigPage = lazy(() => import("./pages/AdminConfigPage"));

const Routes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/admin" component={AdminConfigPage} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default Routes;
