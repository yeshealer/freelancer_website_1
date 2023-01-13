import React from 'react';

export default class ContentHeader extends React.Component {

    getOptionList() {
        const list = [];
        if (this.props.kpi !== undefined && this.props.kpi != null) {
            this.props.kpi.forEach((x, i) => {
                list.push(<option key={"Option_" + i} value={i}>{`${x.label} (${x.label.children ? x.label.children : 0})`}</option>)
            });
        }

        return list;
    }

    render() {
        
        return (
            <header className="filter">
                <div className="title">
                        {`${this.props.kpi.nodeTextMap.title} (${this.props.kpi.children.filter(child => child !== null).length})`}
                </div>
                <div className="clearfix" />
            </header>
        );
    }
}