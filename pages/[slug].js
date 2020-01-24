import React from "react";
import dynamic from "next/dynamic";
const ST = dynamic(() => import("../components/hasCss"));

export default function() {
  return <ST />;
}
