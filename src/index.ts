import {
  useEffect, useState, useCallback, SourceHTMLAttributes, ImgHTMLAttributes,
} from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';

export type ImgAttrs = ImgHTMLAttributes<HTMLImageElement>
export type SourceAttr = SourceHTMLAttributes<HTMLSourceElement>
export type SourceAttrs = SourceAttr[]
export type UseProgressiveImageReturn = [
  boolean,
  Event | string | undefined,
]

const useProgressiveImage = (
  imgAttrs?: ImgAttrs,
  sourcesAttrs?: SourceAttrs,
): UseProgressiveImageReturn => {
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
    if ((imgAttrs?.src) && typeof Image !== 'undefined') {
      const img = document.createElement('img');

      if (sourcesAttrs && sourcesAttrs.length > 0) {
        const pic = document.createElement('picture');
        sourcesAttrs?.forEach((sourceProps) => {
          const source = document.createElement('source');
          Object.assign(source, sourceProps);
          pic.appendChild(source);
        });
        pic?.appendChild(img);
      }

      img.onload = rerender;
      img.onerror = handleError;
      Object.assign(img, imgAttrs);
      return img;
    }
  }, [imgAttrs, sourcesAttrs, rerender, handleError]);

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
