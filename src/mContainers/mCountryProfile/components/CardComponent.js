import React, { Component } from 'react';
import Slider from 'react-slick';

import CarouselComponent from './CarouselComponent';

class CardComponent extends Component {
    componentWillMount() {

    }
    
    componentDidMount() {
    
    }
    
    render() {
        const { scoreAndRankByCountryProfile } = this.props.kpiObjs;

        const carouselIndex = scoreAndRankByCountryProfile.map((realm) => {
            return (
                    <div key={`realm_${realm.id}`} >
                        <CarouselComponent carouselCount={realm.children.length} carouselTitle={realm.label /*realm.nodeTextMap.title*/}/>
                    </div>
            );
        });

        return (null);
    }
}

export default CardComponent;
