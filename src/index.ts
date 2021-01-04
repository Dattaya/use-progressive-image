import {
  useEffect, useState, useMemo, useCallback, SourceHTMLAttributes, ImgHTMLAttributes,
} from 'react';

export type ImgProps = ImgHTMLAttributes<HTMLImageElement>
export type SourceProp = SourceHTMLAttributes<HTMLSourceElement>
export type SourceProps = SourceProp[]

export const useProgressiveImage = (
  imgProps?: ImgProps,
  sourcesProps?: SourceProps,
): [boolean, string | undefined, Event | string | undefined] => {
  const [, setRerender] = useState(false);
  const [errorEvent, setErrorEvent] = useState<Event | string | undefined>(undefined);

  const rerender = useCallback(() => {
    setRerender((prev) => !prev);
  }, []);

  const handleError = useCallback((event: Event | string): void => {
    setErrorEvent(event);
  }, []);

  // eslint-disable-next-line consistent-return
  const image = useMemo<HTMLImageElement | undefined>(() => {
    if ((imgProps?.src) && typeof Image !== 'undefined') {
      let pic: HTMLPictureElement | undefined;
      if (sourcesProps && sourcesProps.length > 0) {
        pic = document.createElement('picture');
        sourcesProps?.forEach((sourceProps) => {
          const source = document.createElement('source');
          Object.assign(source, sourceProps);
          pic.appendChild(source);
        });
      }
      const img = document.createElement('img');
      pic?.appendChild(img);
      img.onload = rerender;
      img.onerror = handleError;
      Object.assign(img, imgProps);
      return img;
    }
    // TODO Deep compare `imgProps` and `sourcesProps` to prevent infinite recursion?
  }, [imgProps, sourcesProps, rerender, handleError]);

  useEffect(() => () => {
    if (image) {
      image.onload = null;
    }
  }, [image]);

  // console.log(image?.currentSrc)

  if (image?.complete || !image) {
    // SSR
    // if (typeof Image === 'undefined' && params.placeholder) {
    //   return [params.placeholder, false]
    // }
    return [false, imgProps?.src ?? undefined, errorEvent];
  }
  return [true, imgProps?.src ?? undefined, errorEvent];
};
