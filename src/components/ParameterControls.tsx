import React from 'react';
import { Sliders } from 'lucide-react';

interface Parameter {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

interface ParameterControlsProps {
  parameters: Parameter[];
  onChange: (index: number, value: number) => void;
  onReset: () => void;
}

export default function ParameterControls({ parameters, onChange, onReset }: ParameterControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <Sliders className="w-5 h-5" />
          <h2>Network Parameters</h2>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Reset to defaults
        </button>
      </div>

      <div className="space-y-4">
        {parameters.map((param, index) => (
          <div key={param.name} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700">
                {param.name}
              </label>
              <span className="text-sm text-gray-500">
                {param.value.toFixed(2)}{param.unit}
              </span>
            </div>
            <input
              type="range"
              min={param.min}
              max={param.max}
              step={param.step}
              value={param.value}
              onChange={(e) => onChange(index, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}