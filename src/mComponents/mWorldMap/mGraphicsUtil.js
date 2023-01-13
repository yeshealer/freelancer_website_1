import React from 'react';

const shapeArray = [
    (cx, cy) => (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="#a9a9a9">
            <circle
                cx={10}
                cy={10}
                r={4}
                fill={"#a9a9a9"}
            />
        </svg>
    ),
    (cx, cy) => (
        <svg x={cx - 10} y={cy - 10} height="64" width="64" viewBox="0 0 64 64" fill="#a9a9a9">
            <polygon
                points="10,5 6,14 14,14"
                fill={"#a9a9a9"}
            />
        </svg>
    ),
    (cx, cy) => (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="#a9a9a9">
            <rect
                x="5"
                y="5"
                height="10"
                width="10"
                fill={"#a9a9a9"}
            />
        </svg>
    ),
    (cx, cy) => (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="#a9a9a9">
            <polygon
                points="5,9 10,5 15,9 14,14 6,14"
                fill={"#a9a9a9"}
            />
        </svg>
    ),
    (cx, cy) => (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="#a9a9a9">
            <polygon
                points="9.9, 1.1, 5.3, 17.78, 15.8, 7.58, 3, 7.58, 13.5, 17.78"
                fill={"#a9a9a9"}
            />
        </svg>
    )
];

export {shapeArray};