import React from "react";
import { useEffect, useState } from "react";

const ProgressBar = ({ progressPercentage }) => {
  const [progress, setProgress] = useState();
  useEffect(() => {
    setProgress(progressPercentage);
  }, [progressPercentage]);
  return (
    <div className="w-full h-6 bg-gray-200 rounded-full">
      <div
        className="h-6 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
        style={{ width: progress }}
      ></div>
    </div>
  );
};

export default ProgressBar;
