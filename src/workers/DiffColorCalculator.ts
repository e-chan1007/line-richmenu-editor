const worker = self as unknown as Worker;

worker.addEventListener("message", ({ data: { imageData } }: MessageEvent<{imageData: ImageData[]}>) => {
  const diffColor = imageData.map(({ data }) => (
    data.map((_, i) => i)
      .filter((_, i) => !(i % 4))
      .map(i => [data[i], data[i + 1], data[i + 2]].reduce((acc, cur) => acc + cur) / 3 / 2.55)
      .reduce((accumrator, brightness) => accumrator + brightness) / (data.length / 4) < 55 ? "white" : "black"));
  worker.postMessage(diffColor);
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
