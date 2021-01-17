# use-progressive-image

Hook for progressive image loading, alternative to [react-progressive-image](https://www.npmjs.com/package/react-progressive-image).

 - No errors in SSR.
 - Supports `<img>` and `<picture>` with `<source>` elements.
 - If image is in browser's cache, `loading` will be immediatelly `false`.
 - Written in TypeScript.

## Install

```bash
$ npm i @ohs/use-progressive-image
$ yarn add @ohs/use-progressive-image
```

## Signature
```tsx
function useProgressiveImage(
  imgAttrs: ImgHTMLAttributes<HTMLImageElement>, 
  sourcesAttrs: SourceHTMLAttributes<HTMLSourceElement>[]
  // returns `loading` and an `Error` event if failed to load
): [boolean, Event | string | undefined] 
```

## Examples
### Simple

```tsx
import React, { useMemo } from 'react';
import useProgressiveImage from '@ohs/use-progressive-image';

export interface ImgProps {
  lqip?: string;
  src?: string;
}

const Img: React.FC<ImgProps> = ({ lqip, src }) => {
  // It's recommended to memoize `img` object, otherwise it will be deep 
  // compared with previous value on each rerender in `useProgressiveImage`
  const img = useMemo(() => ({ src }), [src]);
  const [loading] = useProgressiveImage(img);

  return (
    <img src={loading ? lqip : src} />
  );
};
```
### Load avif image with a fallback

```tsx
import React, { useMemo } from 'react';
import useProgressiveImage from '@ohs/use-progressive-image';

export interface ImgProps {
  lqip?: string;
  src?: string;
  avif?: string;
}

const Img: React.FC<ImgProps> = ({ lqip, src, avif }) => {
  const img = useMemo(() => ({ src }), [src]);
  const sources = useMemo(() => [{ 
    srcset: avif, 
    type: 'image/avif' 
  }], [avif]);

  const [loading] = useProgressiveImage(img, sources);

  return (
    <picture>
      {!loading && <source type="image/avif" srcSet={avif} />}
      <img src={loading ? lqip : src} />
    </picture>
  );
};
```
