import React from 'react';
import './style.css';

export function SampleNextArrow(props) {
	const { className, style, onClick } = props;
	return (
		<div
			// className={className}
			className='kpi-slider-next'
			style={{ ...style, display: 'block' }}
			onClick={onClick}
		>
			<img style={{ width: '20px', opacity: '0.5' }} src="/assets/svg/arrow-right-button.svg" alt="arrow_right" />
		</div>
	);
}

export function SamplePrevArrow(props) {
	const { className, style, onClick } = props;
	return (
		<div
			className='kpi-slider-prev'
			// className={className}
			style={{ ...style, display: 'block' }}
			onClick={onClick}
		>
			<img style={{ width: '20px', opacity: '0.5' }} src="/assets/svg/arrow-left-button.svg" alt="arrow_left" />
		</div>
	);
}