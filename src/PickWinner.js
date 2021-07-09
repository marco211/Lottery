import React from 'react';

const PickWinner = props => {
    console.log(props);
    let { isManager } = props;

    if (isManager) {
        return <div><h4>Ready to pick a winner?</h4><button onClick={props.onClick}>Pick Winner</button></div>;
    } else return <div></div>;
};

export default PickWinner;