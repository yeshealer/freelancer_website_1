import normalizeSliderYear from "./normalizeSliderYear";

function getSelectedYearsForHeader(isSingleYear, selectedYearEnd, selectedYearStart) {
    if (isSingleYear) {
        let avgOfYear = (selectedYearEnd + selectedYearStart) / 2;
        let lastDigit = avgOfYear.toString().split('').pop();
        return normalizeSliderYear(avgOfYear);
    } else {
        return normalizeSliderYear(selectedYearStart) + " - " + normalizeSliderYear(selectedYearEnd);
    }
}

export default getSelectedYearsForHeader;
