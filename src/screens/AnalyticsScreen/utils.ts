export const calculateScoreColor = (
  score: number,
  opacity?: number,
): string => {
  let red, green;
  if (score <= 0.5) {
    red = 255;
    green = Math.round(2 * score * 255);
  } else {
    red = Math.round(2 * (1 - score) * 255);
    green = 255;
  }
  const blue = 0;
  if (opacity) {
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }
  return `rgb(${red}, ${green}, ${blue})`;
};
