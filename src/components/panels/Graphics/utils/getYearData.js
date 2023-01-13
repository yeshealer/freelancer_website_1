import normalizeSliderYear from "./normalizeSliderYear";

function getYearData(selectedYearStart, selectedYearEnd) {

    let isSingleYear = false;
    let selectedSingleYear;
    if (selectedYearEnd - selectedYearStart === 10) {
        let avgOfYear = (selectedYearEnd + selectedYearStart) / 2;
        let lastDigit = avgOfYear.toString().split('').pop();
        selectedSingleYear = normalizeSliderYear(avgOfYear);
        if (lastDigit === '0')
            isSingleYear = true;
    }

    return {
        selectedSingleYear,
        isSingleYear
    }
}

export default getYearData;
