import React from "react";

export interface ProgressBarProps {
  currentStep: number;
  steps: string[];
}

const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["Initiated", "Uploading", "Processing", "Completed"];
  
    return (
      <div className="w-full">
        {/* Labels */}
        <div className="flex justify-between text-sm mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`text-center ${
                index <= currentStep ? "text-white" : "text-gray-400"
              }`}
            >
              {step}
            </div>
          ))}
        </div>
  
        {/* Progress Line */}
        <div className="relative w-full h-1 bg-gray-500 rounded">
          <div
            className="absolute top-0 left-0 h-1 rounded bg-green-500 transition-all duration-300"
            style={{
              width: `${(currentStep / (steps.length)) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;
  

