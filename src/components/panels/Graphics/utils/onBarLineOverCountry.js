import getHoverComponent from './getHoverComponent';
import ReactDOM from 'react-dom';

const onBarLineOverCountry = (graphData, mousePosition) => {
  const { countryName, countryCode, data, denominatorName } = graphData.payload;
  const hoverComponent = getHoverComponent(mousePosition.x, mousePosition.y, countryName,
    countryCode, data, denominatorName, graphData.fill);
  ReactDOM.render(hoverComponent, document.getElementById('tooltip-root'));
};

export default onBarLineOverCountry;
