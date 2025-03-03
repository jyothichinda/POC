import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashboardSkeleton = () => {
  return (
    <div>
      <h2>
        <Skeleton width={200} />
      </h2>
      <Skeleton count={5} height={30} />
    </div>
  );
};

export default DashboardSkeleton;
