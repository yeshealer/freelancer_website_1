const getColorDiv = (weightedScore) => {
    if (weightedScore < 0.5) {
        return 'td-range1';
    } else if (weightedScore < 1) {
        return 'td-range2';
    } else if (weightedScore < 1.5) {
        return 'td-range3';
    } else if (weightedScore < 2) {
        return 'td-range4';
    } else if (weightedScore < 2.5) {
        return 'td-range5';
    } else if (weightedScore < 3) {
        return 'td-range6';
    } else if (weightedScore < 3.5) {
        return 'td-range7';
    } else if (weightedScore < 4) {
        return 'td-range8';
    } else if (weightedScore < 4.5) {
        return 'td-range9';
    }
    return 'td-range10';
};

export default getColorDiv;