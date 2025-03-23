import { PageModel } from '../models';

const album = [
  'X017_00.jpg',
  'X017_01.jpg',
  'X017_02.jpg',
  'X017_03.jpg',
  'X017_04.jpg',
  'X017_05.jpg',
  'X017_06.jpg',
  'X017_07.jpg',
  'X017_08.jpg',
  'X017_09.jpg',
  'X017_10.jpg',
  'X017_11.jpg',
  'X017_12.jpg',
  'X017_13.jpg',
  'X017_14.jpg',
  'X017_15.jpg',
];

function generateAlbum() {
  const pages: PageModel[] = [];

  let i = 0;
  while (i < album.length) {
    pages.push({
      front: `/album/${album[i]}`,
      back: `/album/${album[i + 1]}`,
    });
    i += 2;
  }

  return pages;
}

export const ALBUM_PAGES = generateAlbum();
