import React from "react";
import * as turf from "@turf/turf";

export const calculateArc = (route: IFeatureCollectionRoute, steps: number) => {
  const lineDistance = turf.length(route.features[0]);
  const arc = [];

  // Draw an arc between the `origin` & `destination` of the two points
  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(route.features[0], i);
    arc.push(segment.geometry.coordinates);
  }

  return arc;
};
