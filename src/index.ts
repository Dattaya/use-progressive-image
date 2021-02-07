import {
  useEffect, useState, useCallback,
} from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';

type ImgArg = {
  sizes?: string;
  src?: string;
  srcSet?: string;
}
type SourceArg = {
  sizes?: string;
  src?: string;
  srcSet?: string;
  type?: string;
}
type SourcesArg = SourceArg[]
export type UseProgressiveImageArg = {
  img?: ImgArg | string;
  sources?: SourcesArg;
  ssr: boolean;
}
export type UseProgressiveImageReturn = [
  boolean,
  Event | string | undefined,
]

const isBrowser = typeof window !== 'undefined' && window.document && window.document.createElement;

/**
 * Necessary to prevent mismatch between the client and server on initial render in ssr mode.
 */
const initImages = isBrowser ? Array.from(document.images) : []; // Live array, need to convert to a regular
let normInitImages: string[] | undefined;
const getLazyInitImages = (): string[] => {
  if (!normInitImages) {
    normInitImages = initImages.map((img) => img.src).filter((src) => !src.startsWith('data:image'));
  }
  return normInitImages;
};
const isInitImage = (src: string | undefined): boolean => getLazyInitImages().some((initImgSrc) => initImgSrc?.endsWith(src));
const isInitSsr = (isSsrMode = false, src?: string): boolean => {
  if (isSsrMode && src && isBrowser && document.readyState !== 'complete' && isInitImage(src)) {
    return true;
  }
  return false;
};

function normArg(obj: ImgArg | string): Omit<ImgArg, 'srcSet'> | { 'srcset': ImgArg['srcSet'] }
function normArg(obj: SourceArg): Omit<SourceArg, 'srcSet'> | { 'srcset': SourceArg['srcSet'] }[]
function normArg(obj: any): any {
  const nObj = typeof obj === 'string' ? { src: obj } : obj;
  const normObj = { ...nObj, srcset: nObj.srcSet };
  delete normObj.srcSet;
  Object.keys(normObj).forEach((key) => {
    if (normObj[key] === undefined) {
      delete normObj[key];
    }
  });
  return normObj;
}

const useProgressiveImage = ({
  img: imgArg,
  sources: sourcesArg,
  ssr = false,
}: UseProgressiveImageArg): UseProgressiveImageReturn => {
  const [, setRerender] = useState(false);
  const [errorEvent, setErrorEvent] = useState<Event | string | undefined>(undefined);

  const rerender = useCallback(() => {
    setRerender((prev) => !prev);
  }, []);

  const handleError = useCallback((event: Event | string) => {
    setErrorEvent(event);
  }, []);

  // eslint-disable-next-line consistent-return
  const image = useDeepCompareMemo<HTMLImageElement | undefined>(() => {
    const src = typeof imgArg === 'string' ? imgArg : imgArg.src;
    if (src && isBrowser && !isInitSsr(ssr, src)) {
      const img = document.createElement('img');

      if (sourcesArg && sourcesArg.length > 0) {
        const pic = document.createElement('picture');
        sourcesArg?.forEach((sourceProps) => {
          const source = document.createElement('source');
          Object.assign(source, normArg(sourceProps));
          pic.appendChild(source);
        });
        pic?.appendChild(img);
      }

      img.onload = rerender;
      img.onerror = handleError;
      Object.assign(img, normArg(imgArg));
      return img;
    }
  }, [imgArg, sourcesArg, rerender, handleError, ssr]);

  useEffect(() => () => {
    if (image) {
      image.onload = null;
      image.onerror = null;
    }
  }, [image]);

  if (image?.complete || !image) {
    return [false, errorEvent];
  }
  return [true, errorEvent];
};

export default useProgressiveImage;
