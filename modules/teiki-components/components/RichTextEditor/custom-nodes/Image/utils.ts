type Size = {
  width: number;
  height: number;
};

type Attrs = Record<string, any>;

export function getImageSize(url: string): Promise<Size> {
  return new Promise((resolve) => {
    const image = new window.Image();
    image.onload = function () {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.src = url;
  });
}

export async function getOptimalSize(url: string): Promise<Size> {
  const { width, height } = await getImageSize(url);
  const shrinkRatio = Math.max(
    // 1. Do not enlarge image
    1.0,
    // 2. Resulted width must be at most 800px
    width / 800,
    // 3. Resulted area (width * height) must be at most 4800000 px^2 (800px * 600px)
    Math.sqrt((width * height) / (800 * 600))
  );
  return {
    width: width / shrinkRatio,
    height: height / shrinkRatio,
  };
}

export function parseLengthInPixel(length: unknown): number | null {
  switch (typeof length) {
    case "number":
      return length;
    case "string": {
      const matched = /^([0-9.]+)(px)?$/.exec(length);
      if (!matched) return null;
      return parseFloat(matched[1]);
    }
    default:
      return null;
  }
}

export function getSizeFromAttrs(attrs: Attrs): Size | null {
  const width = parseLengthInPixel(attrs.width);
  const height = parseLengthInPixel(attrs.height);
  if (width == null || height == null) return null;
  return { width, height };
}

export function autoIncreaseSize(size: Size) {
  // TODO: we need to make it smarter
  return {
    width: size.width * Math.cbrt(2),
    height: size.height * Math.cbrt(2),
  };
}

export function autoDecreaseSize(size: Size) {
  // TODO: we need to make it smarter
  return {
    width: size.width / Math.cbrt(2),
    height: size.height / Math.cbrt(2),
  };
}
