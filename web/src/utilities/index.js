import { CATALOG_TAB } from '../constants/index';

const tagCodeToColor = (num, opacity) => {
  num >>>= 0;
  const b = num & 0xFF;
  const g = (num & 0xFF00) >>> 8;
  const r = (num & 0xFF0000) >>> 16;
  const a = opacity || 1;

  return `rgba(${[r, g, b, a].join(',')})`;
};

const getSource = (tab, idLabelFilter) => {
  let data = 'source';

  if (tab !== CATALOG_TAB) {
    data = 'sourceWishList';
  } else if (idLabelFilter) {
    data = 'sourceFiltered';
  }

  return data;
};

export {
  getSource,
  tagCodeToColor,
};
