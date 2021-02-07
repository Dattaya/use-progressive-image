/* eslint-disable no-plusplus, max-len */
import React, { useRef } from 'react';

import useProgressiveImage, { UseProgressiveImageArg } from '../src';
import Log from './Log';

interface ImgProps {
  imgKey?: number;
  img?: UseProgressiveImageArg['img'];
}

const placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TtUUqHewg4pChdrIgKuKoVShChVArtOpg8tI/aNKQtLg4Cq4FB38Wqw4uzro6uAqC4A+Im5uToouUeF9SaBHjhcf7OO+ew3v3AUKzwjSrZxzQ9JqZTibEbG5VDLzChz4EEUZMZpYxJ0kpeNbXPXVT3cV5lnffnzWg5i0G+ETiWWaYNeIN4unNmsF5nzjCSrJKfE48ZtIFiR+5rrj8xrnosMAzI2YmPU8cIRaLXax0MSuZGvEUcVTVdMoXsi6rnLc4a5U6a9+TvzCU11eWuU5rBEksYgkSRCioo4wKaojTrpNiIU3nCQ//sOOXyKWQqwxGjgVUoUF2/OB/8Hu2VmFywk0KJYDeF9v+GAUCu0CrYdvfx7bdOgH8z8CV3vFXm8DMJ+mNjhY9AsLbwMV1R1P2gMsdYOjJkE3Zkfy0hEIBeD+jb8oBg7dA/5o7t/Y5Th+ADM0qdQMcHAKxImWve7w72D23f3va8/sBFkRygrAC7p0AAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflAQYIFApSPjkOAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAACpJREFUSMdjNEszY6ANYGKgGRg1etToUaNHjR41etToUaNHjR41evgbDQAI/AEOR1qxDgAAAABJRU5ErkJggg==';

const Img: React.FC<ImgProps> = ({ imgKey, img: imgProp = '/img.png' }) => {
  const numOfRerenders = useRef(0);
  // const img = typeof imgProp === 'string' ? `${imgProp}${Number.isInteger(imgKey) ? `?${imgKey}` : ''}` : imgProp;
  // const src = typeof img === 'string' ? img : img?.src;
  const img = typeof imgProp === 'string' ? { src: `${imgProp}${Number.isInteger(imgKey) ? `?${imgKey}` : ''}` } : imgProp;
  const [loading, error] = useProgressiveImage({ img, ssr: true });

  return (
    <>
      <img id="img" width="300" height="300" {...imgProp} src={loading ? placeholder : img?.src} alt="" />
      <Log message={loading ? 'loading' : 'not loading'} />
      <div id="error">{error ? 'error' : ''}</div>
      <div id="numOfRerenders">{++numOfRerenders.current}</div>
    </>
  );
};

export default Img;
