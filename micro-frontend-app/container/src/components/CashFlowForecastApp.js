import React, { useEffect, useRef } from "react";
import { mount } from "forecast/ForecastPage";

export default () => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current);
  }, []);

  return <div ref={ref} />;
};
