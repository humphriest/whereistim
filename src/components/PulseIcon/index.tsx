import React from "react";

export const createPulseIcon = (map: any) => {
  const size = 150;

  return {
    width: size,
    height: size,
    data: new Uint8ClampedArray(size * size * 4),
    context: null as CanvasRenderingContext2D | null,

    onAdd: function () {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext("2d");
    },

    // Call once before every frame where the icon will be used.
    render: function () {
      const duration = 2000;
      const t = (performance.now() % duration) / duration;

      const radius = (size / 2) * 0.3;
      const outerRadius = (size / 2) * 0.7 * t + radius;
      const context = this.context;

      if (!context) return false;
      // Draw the outer circle.
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
      context.fillStyle = `rgba(31, 81, 255, ${1 - t})`;
      context.fill();
      context.stroke();

      // Update this image's data with data from the canvas.
      this.data = context.getImageData(0, 0, this.width, this.height).data;

      // Continuously repaint the map, resulting
      // in the smooth animation of the dot.
      map.current.triggerRepaint();

      // Return `true` to let the map know that the image was updated.
      return true;
    },
  };
};
