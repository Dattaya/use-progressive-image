# use-progressive-image

Hook for progressive image loading, alternative to [react-progressive-image](https://www.npmjs.com/package/react-progressive-image).

 - Supports `<img>` and `<picture>` with `<source>` elements.
 - If image is in browser's cache, `loading` will be immediatelly `false` in Chrome, Firefox, and Edge.
 - SSR: if it takes more time to load an image than to load, and parse js, and to initialize React, there might be a mismatch and loading would be `true` on the client when that happens. If you want to prevent that, set `ssr` to `true`. But this option might not work in development if you're using webpack, probably because webpack dev environment is a little bit magical.
 - Written in TypeScript.

## Install

```bash
$ npm i @ohs/use-progressive-image
$ yarn add @ohs/use-progressive-image
```

## Signature
```tsx
function useProgressiveImage({
  img?: string | { sizes?: string; src?: string; srcSet?: string; };
  sources?: { sizes?: string; src?: string; srcSet?: string; type?: string; }[];
  ssr?: boolean; // set to true if it's an SSR app
  // returns `loading` and an `Error` event if failed to load
}): [boolean, Event | string | undefined] 
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
  const [loading] = useProgressiveImage({ img: src });

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
  // It's recommended to memoize `sources` array, otherwise it will be deep 
  // compared with previous value on each rerender in `useProgressiveImage`
  const sources = useMemo(() => [{ 
    srcSet: avif, 
    type: 'image/avif' 
  }], [avif]);

  const [loading] = useProgressiveImage({ img: src, sources });

  return (
    <picture>
      {!loading && <source {...sources[0]} />}
      <img src={loading ? lqip : src} />
    </picture>
  );
};
```
