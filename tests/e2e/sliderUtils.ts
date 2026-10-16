import type { Locator } from '@playwright/test';

/** Область нативного thumb внутри input, без остальной дорожки. */
export const getSliderThumbBox = async (input: Locator) => {
  await input.scrollIntoViewIfNeeded();
  return input.evaluate((element: HTMLInputElement) => {
    const box = element.getBoundingClientRect();
    const radius = parseFloat(getComputedStyle(element).getPropertyValue('--slider-thumb-radius'));
    const min = Number(element.min);
    const max = Number(element.max);
    const position = max > min ? (element.valueAsNumber - min) / (max - min) : 0;
    return {
      x: box.x + (box.width - radius * 2) * position,
      y: box.y + box.height / 2 - radius,
      width: radius * 2,
      height: radius * 2,
    };
  });
};

/** Chromium не раскрывает computed style thumb; проверяем отрисованные цвета без файлов эталонов. */
export const readSliderThumbColors = async (input: Locator) => {
  const clip = await getSliderThumbBox(input);
  const screenshot = await input.page().screenshot({ clip, animations: 'disabled' });
  return input.page().evaluate(async (data) => {
    const image = new Image();
    image.src = `data:image/png;base64,${data}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context is unavailable');
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, image.width, image.height).data;
    const colors: Record<string, number> = {};
    for (let index = 0; index < pixels.length; index += 4) {
      const color = `rgb(${pixels[index]}, ${pixels[index + 1]}, ${pixels[index + 2]})`;
      colors[color] = (colors[color] ?? 0) + 1;
    }
    return colors;
  }, screenshot.toString('base64'));
};
