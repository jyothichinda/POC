import React, { lazy,Suspense } from "react";
import {unstable_HistoryRouter as Router, Routes,Route} from 'react-router-dom'
import LoginPage from "./pages/LoginPage";


const App = () => {
  <div>
    <h1>LQM App</h1>
    <Suspense fallback={<InfinityLoader />}>
    <div style={styles.container}>
      <DashboardApp />
    </div>
    </Suspense>
  </div>;
};

export default App;
