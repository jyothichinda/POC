import React, { useEffect, useState } from "react";
import useAuthStore from "../../../micro-frontend-app1/src/store/authStore";
import DashBoardSkeleton from "./components/DashboardSkeleton";

const App = () => {
  const [loading, setLoading] = useState(true);

  const {token} = useAuthStore()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  if(!token) {
    return <h3> Access Denied. Please login</h3>
  }

  return loading ? <DashBoardSkeleton /> : <h2>Dashboard of Cash Flow</h2>;
};

export default App;
