import { PageModel } from '../models';

const album = [
  'X017_00_01.jpg',
  'X017_01_01.jpg',
  'X017_01_02.jpg',
  'X017_02_01.jpg',
  'X017_02_02.jpg',
  'X017_03_01.jpg',
  'X017_03_02.jpg',
  'X017_04_01.jpg',
  'X017_04_02.jpg',
  'X017_05_01.jpg',
  'X017_05_02.jpg',
  'X017_06_01.jpg',
  'X017_06_02.jpg',
  'X017_07_01.jpg',
  'X017_07_02.jpg',
  'X017_08_01.jpg',
  'X017_08_02.jpg',
  'X017_09_01.jpg',
  'X017_09_02.jpg',
  'X017_10_01.jpg',
  'X017_10_02.jpg',
  'X017_11_01.jpg',
  'X017_11_02.jpg',
  'X017_12_01.jpg',
  'X017_12_02.jpg',
  'X017_13_01.jpg',
  'X017_13_02.jpg',
  'X017_14_01.jpg',
  'X017_14_02.jpg',
  'X017_15_01.jpg',
  'X017_15_02.jpg',
  'X017_00_02.jpg',
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
