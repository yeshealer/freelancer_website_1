const normalizeSliderYear = function(year) {
    let number = parseInt(year.toString().substr(0, 4));
    if (number < 2000)
        return 2000;
    else if (number > 2018)
        return 2018;
    return number;
};

export default normalizeSliderYear;
