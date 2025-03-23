import { FC } from 'react';
import { ALBUM_PAGES } from '../configs/album.config';

import { Page } from './Page';

interface BookProps {
  position?: [number, number, number];
}

export const Book: FC<BookProps> = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position} rotation-y={-Math.PI / 2}>
      {[...ALBUM_PAGES].map((pageData, index) => (
        <Page
          key={index}
          number={index}
          front={pageData.front}
          back={pageData.back}
        />
      ))}
    </group>
  );
};
