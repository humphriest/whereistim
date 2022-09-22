export const typeWriter = (sentence: string, element: HTMLElement) => {
  const currentSentence: string[] = [];
  let i = 0;
  let isFinished = false;

  const loop = () => {
    if (i < sentence.length) {
      currentSentence.push(sentence[i]);
      i++;
    }

    if (i === sentence.length) {
      isFinished = true;
    }
    if (i !== sentence.length && !isFinished) {
      setTimeout(loop, 500);
    }

    element.innerHTML = currentSentence.join("");
  };
  loop();
};
