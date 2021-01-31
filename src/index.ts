import {
  useState, useCallback, SourceHTMLAttributes, ImgHTMLAttributes, useLayoutEffect, useEffect,
} from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';

export type ImgAttrs = ImgHTMLAttributes<HTMLImageElement>
export type SourceAttr = SourceHTMLAttributes<HTMLSourceElement>
export type SourceAttrs = SourceAttr[]
export type UseProgressiveImageReturn = [
  boolean,
  Event | string | undefined,
]

const isBrowser = typeof window !== 'undefined' && window.document && window.document.createElement;
const useBrowserLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

const useDeepLayoutEffect = (effect: React.EffectCallback, deps?: React.DependencyList): void => {
  const memoDeps = useDeepCompareMemo(() => deps, [deps]);
  useBrowserLayoutEffect(effect, memoDeps); // eslint-disable-line react-hooks/exhaustive-deps
};

const useProgressiveImage = (
  imgAttrs?: ImgAttrs,
  sourcesAttrs?: SourceAttrs,
): UseProgressiveImageReturn => {
  const [errorEvent, setErrorEvent] = useState<Event | string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleError = useCallback((event: Event | string) => {
    setLoading(false);
    setErrorEvent(event);
  }, []);

  const handleOnLoad = useCallback(() => {
    setLoading(false);
  }, []);

  useDeepLayoutEffect(() => {
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

    img.onload = handleOnLoad;
    img.onerror = handleError;
    Object.assign(img, imgAttrs);
    if (!img.complete) {
      setLoading(true);
    }

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imgAttrs, sourcesAttrs, handleError, handleOnLoad]);

  return [loading, errorEvent];
};

export default useProgressiveImage;
