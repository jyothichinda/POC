import React, { useEffect, useRef } from "react";
import { mount } from "sweeping/SweepingPage";

export default () => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current);
  }, []);

  return <div ref={ref} />;
};
