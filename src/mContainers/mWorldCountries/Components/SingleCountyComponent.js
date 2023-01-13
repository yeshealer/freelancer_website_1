import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import generalUtils from '../../../mCommons/mUtils/generalUtils';
import { getLanguageKey } from '../../../utils';

import setSelectedCountryAction from '../../../redux/actions/setSelectedCountryAction';

class SingleCountryComponent extends Component {
	render() {				
		const { countryId } = this.props.country;
		const { name: countryName } = this.props.country.countryTextMap;
		return (
			<Link
				to={`/country-profile/${countryId}?lang=${getLanguageKey()}`}
				onClick={() => {
					generalUtils.createCookie('countryId', countryId);
					this.props.setSelectedCountryAction(this.props.country);
				}} >
				{countryName}
			</Link>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		selectedKPIPath: state.coreReducer.selectedKPIPath,
		selectedCountry: state.coreReducer.selectedCountry,
	};
};

const actions = {
	setSelectedCountryAction,
};

export default connect(mapStateToProps, actions)(SingleCountryComponent);
