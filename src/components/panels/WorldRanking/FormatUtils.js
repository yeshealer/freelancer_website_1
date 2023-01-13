import numeral from "numeral";
import React from "react";
import {Link} from "react-router-dom";
import { getLanguageKey } from '../../../utils'

class FormatUtils {
    static rankFormat(cell, row) {
        if (row.rankChange !== undefined && row.rankChange !== null && row.rankChange !== 0) {
            if (row.rankChange > 0)
                return (<span className="world-ranking-rank rank-up"><span>{cell}</span> <span><img
                    src="/assets/svg/rank-up.svg"/>{row.rankChange}</span></span>);
            else
                return (<span className="world-ranking-rank rank-down"><span>{cell}</span> <span><img
                    src="/assets/svg/rank-down.svg"/>{row.rankChange.toString().substring(1)}</span></span>);
        } else
            return (<span className="world-ranking-rank rank-down"><span>{cell}</span></span>);
    }

    static countryFormat(data, countryIdMap) {
        if (countryIdMap[data] === undefined) {
            return;
        }

        return (
            <Link
                className="whiteURL"
                to={'/country-profile/' + data + '?lang=' + getLanguageKey()}>
                {countryIdMap[data].countryTextMap.name}
            </Link>
        );
    }


    static columnDataFormat(data) {
        return numeral(data).format('0.0a');
    }

    static columnClassNameFormat(fieldValue, row, rowIdx, colIdx) {
        if (row.weightedScore < 0.5) {
            return 'td-range1';
        } else if (row.weightedScore < 1) {
            return 'td-range2';
        } else if (row.weightedScore < 1.5) {
            return 'td-range3';
        } else if (row.weightedScore < 2) {
            return 'td-range4';
        } else if (row.weightedScore < 2.5) {
            return 'td-range5';
        } else if (row.weightedScore < 3) {
            return 'td-range6';
        } else if (row.weightedScore < 3.5) {
            return 'td-range7';
        } else if (row.weightedScore < 4) {
            return 'td-range8';
        } else if (row.weightedScore < 4.5) {
            return 'td-range9';
        } else {
            return 'td-range10';
        }
    }

}

export default FormatUtils;
