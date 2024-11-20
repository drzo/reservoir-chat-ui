import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: number;
  group: number;
  value: number;
  type?: 'input' | 'reservoir' | 'output';
}

interface Link {
  source: number;
  target: number;
  value: number;
  type?: 'input' | 'reservoir' | 'output';
}

interface NetworkVisualizationProps {
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
  activeNodes?: number[];
}

export default function NetworkVisualization({ 
  nodes, 
  links, 
  width = 600, 
  height = 400,
  activeNodes = []
}: NetworkVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = React.useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const svg = d3.select(containerRef.current)
      .selectAll('svg')
      .data([null])
      .join('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    // Clear previous content
    svg.selectAll('*').remove();

    // Add gradient definitions
    const defs = svg.append('defs');
    
    // Active node gradient
    defs.append('radialGradient')
      .attr('id', 'activeGradient')
      .selectAll('stop')
      .data([
        { offset: '0%', color: 'rgba(99, 102, 241, 0.8)' },
        { offset: '100%', color: 'rgba(99, 102, 241, 0.2)' }
      ])
      .join('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter())
      .force('collision', d3.forceCollide().radius(8));

    // Draw links with gradients
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => {
        if (d.type === 'input') return '#818cf8';
        if (d.type === 'output') return '#34d399';
        return '#9ca3af';
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value) * 2);

    // Create node groups
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(drag(simulation));

    // Add circles to node groups
    node.append('circle')
      .attr('r', 6)
      .attr('fill', d => {
        if (d.type === 'input') return '#818cf8';
        if (d.type === 'output') return '#34d399';
        return '#9ca3af';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    // Add active node indicators
    node.filter(d => activeNodes.includes(d.id))
      .append('circle')
      .attr('r', 15)
      .attr('fill', 'url(#activeGradient)')
      .attr('class', 'active-indicator');

    // Add hover effects
    node
      .on('mouseover', (event, d) => {
        setHoveredNode(d.id);
        d3.select(event.currentTarget)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', 8);
      })
      .on('mouseout', (event) => {
        setHoveredNode(null);
        d3.select(event.currentTarget)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', 6);
      });

    // Add node labels
    node.append('title')
      .text(d => `Node ${d.id} (${d.type || 'reservoir'})`);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [nodes, links, width, height, activeNodes]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full bg-white rounded-lg shadow-sm p-4">
        <div className="absolute top-4 left-4 text-sm text-gray-600 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span>Input nodes</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            <span>Reservoir nodes</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Output nodes</span>
          </div>
        </div>
        {hoveredNode !== null && (
          <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm">
            Node {hoveredNode}
          </div>
        )}
      </div>
    </div>
  );
}

function drag(simulation: d3.Simulation<any, undefined>) {
  function dragstarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
}