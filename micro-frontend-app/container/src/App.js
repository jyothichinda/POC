import React, { Suspense } from "react";

const DashboardApp = React.lazy(() => import("microfrontend1/DashboardApp"));

const App = () => {
  <div>
    <h1>Container App</h1>
    <Suspense fallback={<div>Loading....</div>}>
      <DashboardApp />
    </Suspense>
  </div>;
};

export default App;
