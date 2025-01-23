import React from "react";

const Ping = () => {
  return (
    <div className="relative">
      <div className="absolute -left-4 top-1">
        <span className="flex size-[21px]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-75"></span>
          <span className="relative inline-flex size-[21px] rounded-full bg-green-600"></span>
        </span>
      </div>
    </div>
  );
};
export default Ping;
