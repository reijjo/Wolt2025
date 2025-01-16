export const customTestId = (id: string) => {
  return document.querySelector(`[data-test-id="${id}"]`) as Element;
};
