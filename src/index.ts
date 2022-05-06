import {
  useEffect, useState, useCallback,
} from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';

type ImgArg = Pick<React.ComponentProps<'img'>, 'sizes' | 'src' | 'srcSet' | 'crossOrigin' | 'decoding' | 'referrerPolicy'>;
type SourceArg = Pick<React.ComponentProps<'source'>, 'sizes' | 'src' | 'srcSet' | 'type' | 'media'>;

type SourcesArg = SourceArg[]
export type UseProgressiveImageArg = {
  img?: ImgArg | string;
  sources?: SourcesArg;
  ssr?: boolean;
}
export type UseProgressiveImageReturn = [
  boolean,
  Event | string | undefined,
]

const isBrowser = typeof window !== 'undefined' && window.document && window.document.createElement;

/**
 * Necessary to prevent mismatch between the client and server on initial render in ssr mode.
 */
const initImages = isBrowser ? Array.from(document.images) : []; // Live array, need to convert to regular
let normInitImages: string[] | undefined;
const getLazyInitImages = (): string[] => {
  if (!normInitImages) {
    normInitImages = initImages.map((img) => img.src).filter((src) => !src.startsWith('data:image'));
  }
  return normInitImages;
};
const isInitImage = (src: string): boolean => getLazyInitImages().some(
  (initImgSrc) => initImgSrc.endsWith(src),
);
const isInitSsr = (src?: string, isSsrMode = false): boolean => !!(
  isSsrMode && src && isBrowser && document.readyState !== 'complete' && isInitImage(src)
);

type NormImgArg = Omit<ImgArg, 'srcSet'> | { 'srcset': ImgArg['srcSet'] };
type NormSourceArg = Omit<SourceArg, 'srcSet'> | { 'srcset': SourceArg['srcSet'] }

function normArg(obj: ImgArg): NormImgArg
function normArg(obj: SourceArg): NormSourceArg
function normArg(obj: SourceArg): NormSourceArg
function normArg(obj: any): any {
  const normObj = { ...obj, srcset: obj.srcSet };
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
    const src = typeof imgArg === 'string' ? imgArg : imgArg?.src;
    if (src && isBrowser && !isInitSsr(src, ssr)) {
      const img = document.createElement('img');

      if (sourcesArg && sourcesArg.length > 0) {
        const pic = document.createElement('picture');
        sourcesArg.forEach((sourceProps) => {
          const source = document.createElement('source');
          Object.assign(source, normArg(sourceProps));
          pic.appendChild(source);
        });
        pic.appendChild(img);
      }

      img.onload = rerender;
      img.onerror = handleError;
      Object.assign(img, normArg(typeof imgArg === 'string' ? { src: imgArg } : imgArg!)); // eslint-disable-line @typescript-eslint/no-non-null-assertion
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
