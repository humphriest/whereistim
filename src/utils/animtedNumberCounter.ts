import { CountUp } from "utils/countUp";

export const animatedNumberCounter = (total: number, element: HTMLElement) => {
  let count = 0;

  if (count < total) {
    const counter = new CountUp(element, total, {
      useEasing: true,
      useGrouping: true,
      separator: ",",
    });
    counter.start();
  } else {
    element.innerHTML = `${total} Kms`;
  }
};
