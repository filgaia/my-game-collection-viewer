const tagCodeToColor = (num, opacity) => {
    num >>>= 0;
    const b = num & 0xFF;
    const g = (num & 0xFF00) >>> 8;
    const r = (num & 0xFF0000) >>> 16;
    const a = opacity || 1;

    return `rgba(${[r, g, b, a].join(',')})`;
};

export {
    tagCodeToColor
};
