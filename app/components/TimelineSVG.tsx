import React from 'react';

interface TimelineSVGProps {
  steps: number;
  selectedStep: number;
  onStepClick: (index: number) => void;
}

const TimelineSVG: React.FC<TimelineSVGProps> = ({ steps, selectedStep, onStepClick }) => {
  const width = 900;
  const height = 200;
  const stepWidth = (width - (2 * 20)) / (steps - 1);
  const circleRadius = 20;
  const lineY = height / 2;

  return (
    <div className="flex justify-center w-full">
      <svg width={width} height={height} className="w-full max-w-[900px]">
        {/* Main timeline line */}
        <line
          x1={circleRadius}
          y1={lineY}
          x2={width - circleRadius}
          y2={lineY}
          stroke="#4B5563"
          strokeWidth="4"
        />

        {/* Progress line */}
        <line
          x1={circleRadius}
          y1={lineY}
          x2={selectedStep === steps - 1 ? width - circleRadius : circleRadius + (stepWidth * selectedStep)}
          y2={lineY}
          stroke="#e6ff75"
          strokeWidth="4"
        />

        {/* Step circles */}
        {Array.from({ length: steps }).map((_, index) => {
          const x = circleRadius + (stepWidth * index);
          const isSelected = index === selectedStep;
          const isPast = index < selectedStep;

          return (
            <g key={index} onClick={() => onStepClick(index)} style={{ cursor: 'pointer' }}>
              {/* Circle background */}
              <circle
                cx={x}
                cy={lineY}
                r={circleRadius}
                fill={isSelected ? "#e6ff75" : isPast ? "#e6ff75" : "#1F2937"}
                stroke={isSelected ? "#e6ff75" : "#4B5563"}
                strokeWidth="2"
              />
              {/* Step number */}
              <text
                x={x}
                y={lineY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected ? "#1F2937" : "#9CA3AF"}
                fontSize="16"
                fontWeight="bold"
              >
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default TimelineSVG; 