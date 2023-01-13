import numeral from "numeral";

function formatTick(x) {
    if (x > 1000000000) {
        return (Math.round(x * 10 / 1000000000) / 10) + "B";
    } else {
        return numeral(x).format('0.00a');
    }
}

export default formatTick;