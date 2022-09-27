export const typeWriter = (
  sentence: string,
  element: HTMLElement,
  callback?: () => void
) => {
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
      callback?.();
    }
    if (i !== sentence.length && !isFinished) {
      setTimeout(loop, 450);
    }

    element.innerHTML = currentSentence.join("");
  };
  loop();
};
