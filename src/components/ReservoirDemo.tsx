import React, { useState, useCallback, useEffect } from 'react';
import { Settings, Play, Database, Network } from 'lucide-react';
import NetworkVisualization from './NetworkVisualization';
import PerformanceMetrics from './PerformanceMetrics';
import ParameterControls from './ParameterControls';
import { ReservoirComputer } from '../lib/reservoir';

const defaultParameters = [
  { name: 'Reservoir Size', value: 100, min: 10, max: 1000, step: 10 },
  { name: 'Spectral Radius', value: 0.9, min: 0, max: 2, step: 0.1 },
  { name: 'Input Scaling', value: 0.1, min: 0, max: 1, step: 0.01 },
  { name: 'Leaking Rate', value: 0.3, min: 0, max: 1, step: 0.01 }
];

export default function ReservoirDemo() {
  const [parameters, setParameters] = useState(defaultParameters);
  const [reservoir, setReservoir] = useState<ReservoirComputer | null>(null);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [metrics, setMetrics] = useState({
    trainingMSE: 0,
    validationMSE: 0,
    spectralRadius: 0.9,
    memoryCapacity: 0
  });

  useEffect(() => {
    const rc = new ReservoirComputer(
      parameters[0].value,
      1,
      1,
      parameters[1].value,
      parameters[3].value
    );
    setReservoir(rc);
  }, [parameters]);

  const generateData = useCallback(() => {
    const length = 1000;
    const inputs: number[][] = [];
    const targets: number[][] = [];
    
    for (let i = 0; i < length; i++) {
      const t = i * 0.1;
      inputs.push([Math.sin(t) + 0.1 * Math.random()]);
      targets.push([Math.sin(t + 0.1)]);
    }
    
    return { inputs, targets };
  }, []);

  const runSimulation = useCallback(async () => {
    if (!reservoir) return;
    setIsSimulating(true);

    const { inputs, targets } = generateData();
    const splitIndex = Math.floor(inputs.length * 0.8);
    
    // Animate training process
    for (let i = 0; i < splitIndex; i += 10) {
      if (i % 50 === 0) {
        const activeIndices = Array.from(
          { length: 5 },
          () => Math.floor(Math.random() * parameters[0].value)
        );
        setActiveNodes(activeIndices);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      reservoir.update(inputs[i]);
    }

    reservoir.train(
      inputs.slice(0, splitIndex),
      targets.slice(0, splitIndex)
    );
    
    let trainMSE = 0;
    let validMSE = 0;
    
    inputs.slice(0, splitIndex).forEach((input, i) => {
      const output = reservoir.update(input);
      trainMSE += Math.pow(output[0] - targets[i][0], 2);
    });
    
    inputs.slice(splitIndex).forEach((input, i) => {
      const output = reservoir.update(input);
      validMSE += Math.pow(output[0] - targets[i + splitIndex][0], 2);
    });
    
    setMetrics({
      trainingMSE: trainMSE / splitIndex,
      validationMSE: validMSE / (inputs.length - splitIndex),
      spectralRadius: parameters[1].value,
      memoryCapacity: reservoir.getStates().length / inputs.length
    });

    setIsSimulating(false);
    setActiveNodes([]);
  }, [reservoir, parameters, generateData]);

  const handleParameterChange = useCallback((index: number, newValue: number) => {
    setParameters(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], value: newValue };
      return updated;
    });
  }, []);

  const handleReset = useCallback(() => {
    setParameters(defaultParameters);
  }, []);

  const networkData = reservoir ? {
    nodes: [
      // Input node
      { id: 0, group: 0, value: 1, type: 'input' },
      // Reservoir nodes
      ...Array.from({ length: parameters[0].value }, (_, i) => ({
        id: i + 1,
        group: 1,
        value: Math.random(),
        type: 'reservoir'
      })),
      // Output node
      { id: parameters[0].value + 1, group: 2, value: 1, type: 'output' }
    ],
    links: [
      // Input connections
      ...Array.from({ length: Math.floor(parameters[0].value * 0.3) }, () => ({
        source: 0,
        target: Math.floor(Math.random() * parameters[0].value) + 1,
        value: Math.random(),
        type: 'input'
      })),
      // Reservoir connections
      ...Array.from({ length: parameters[0].value * 2 }, () => ({
        source: Math.floor(Math.random() * parameters[0].value) + 1,
        target: Math.floor(Math.random() * parameters[0].value) + 1,
        value: Math.random(),
        type: 'reservoir'
      })),
      // Output connections
      ...Array.from({ length: Math.floor(parameters[0].value * 0.3) }, () => ({
        source: Math.floor(Math.random() * parameters[0].value) + 1,
        target: parameters[0].value + 1,
        value: Math.random(),
        type: 'output'
      }))
    ]
  } : { nodes: [], links: [] };

  return (
    <div className="bg-gray-50 rounded-xl shadow-lg">
      <div className="p-6 grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg p-4 shadow-sm">
          <NetworkVisualization
            nodes={networkData.nodes}
            links={networkData.links}
            width={600}
            height={400}
            activeNodes={activeNodes}
          />
        </div>
        
        <div className="space-y-6">
          <ParameterControls
            parameters={parameters}
            onChange={handleParameterChange}
            onReset={handleReset}
          />
          <PerformanceMetrics metrics={metrics} />
        </div>
      </div>

      <div className="p-4 border-t bg-white rounded-b-xl flex justify-end space-x-4">
        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className={`px-4 py-2 ${
            isSimulating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white rounded-lg flex items-center space-x-2`}
        >
          <Play className="w-4 h-4" />
          <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
        </button>
      </div>
    </div>
  );
}