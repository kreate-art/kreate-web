type Size = {
  width: number;
  height: number;
};

type Attrs = Record<string, any>;

export function getVideoSize(url: string): Promise<Size> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.onloadeddata = function () {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };
    video.src = url;
  });
}

export async function getOptimalSize(url: string): Promise<Size> {
  const { width, height } = await getVideoSize(url);
  const shrinkRatio = Math.max(
    1.0,
    width / 800,
    (width * height) / (800 * 600)
  );
  return {
    width: width / shrinkRatio,
    height: height / shrinkRatio,
  };
}

export function getSizeFromAttrs(attrs: Attrs): Size | null {
  const widthMatches = /^([0-9.]+)px$/.exec(attrs.width);
  const heightMatches = /^([0-9.]+)px$/.exec(attrs.height);
  if (!widthMatches || !heightMatches) return null;
  return {
    width: parseFloat(widthMatches[1]),
    height: parseFloat(heightMatches[1]),
  };
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

export function getAttrsFromSize(size: Size): Attrs {
  return {
    width: `${size.width}px`,
    height: `${size.height}px`,
  };
}
