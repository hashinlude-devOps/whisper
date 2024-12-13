import React from "react";

export interface ProgressBarProps {
  currentStep: number;
  steps: string[];
}

const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Uploading", "Processing", "Completed"];
  
  return (
    <div className="w-full">
      {/* Labels */}
      <div className="flex justify-between text-sm mb-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center text-center ${
              index < currentStep ? "text-white" : "text-gray-400"
            }`}
          >
            {/* Step Label */}
            {step}
            
            {/* Show green tick if the step is completed */}
            {index < (currentStep-1) && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 ml-1 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Progress Line */}
      <div className="relative w-full h-1 bg-gray-500 rounded">
        <div
          className="absolute top-0 left-0 h-1 rounded bg-green-500 transition-all duration-300"
          style={{
            width: `${(currentStep / steps.length) * 100}%`, // Fix: use (steps.length - 1) to divide correctly
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
