import React from "react";
import ForeCastTable from "./components/ForeCastTable";
import CardsContainer from "./components/Cards";
import { Row } from "antd";

const App = () => {
  return (
    <Row>
      <CardsContainer />
      <ForeCastTable />
    </Row>
  );
};

export default App;
