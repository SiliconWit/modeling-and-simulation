import React, { useState, useEffect, useRef } from 'react';

const PendulumDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Simulation parameters
  const [isRunning, setIsRunning] = useState(false);
  const [length, setLength] = useState(1.0);
  const [initialAngle, setInitialAngle] = useState(0.3);
  const [damping, setDamping] = useState(0.0);
  
  // Simulation state
  const [theta, setTheta] = useState(0.3);
  const [omega, setOmega] = useState(0.0);
  const [time, setTime] = useState(0);
  
  // Constants
  const g = 9.81;
  const dt = 0.016; // ~60 FPS
  const scale = 150; // pixels per meter
  const centerX = 200;
  const centerY = 50;
  
  // Reset simulation
  const reset = () => {
    setIsRunning(false);
    setTheta(initialAngle);
    setOmega(0);
    setTime(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
  
  // Physics update
  const updatePhysics = () => {
    if (!isRunning) return;
    
    // Pendulum equation: d²θ/dt² = -(g/L)sin(θ) - damping*dθ/dt
    const acceleration = -(g / length) * Math.sin(theta) - damping * omega;
    
    setOmega(prev => prev + acceleration * dt);
    setTheta(prev => prev + omega * dt);
    setTime(prev => prev + dt);
  };
  
  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        updatePhysics();
        drawPendulum();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, theta, omega, length, damping]);
  
  // Draw pendulum
  const drawPendulum = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate bob position
    const bobX = centerX + length * scale * Math.sin(theta);
    const bobY = centerY + length * scale * Math.cos(theta);
    
    // Draw ceiling
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(0, 40, canvas.width, 10);
    
    // Draw pivot point
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw string
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();
    
    // Draw bob
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bobX, bobY, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Draw angle arc
    if (Math.abs(theta) > 0.05) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, -Math.PI/2, theta - Math.PI/2, theta > 0);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw vertical reference line
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + length * scale + 20);
    ctx.stroke();
    ctx.setLineDash([]);
  };
  
  // Initial draw
  useEffect(() => {
    drawPendulum();
  }, [theta, length]);
  
  const naturalFreq = Math.sqrt(g / length);
  const period = 2 * Math.PI / naturalFreq;
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center">Interactive Pendulum Simulation</h3>
      
      {/* Canvas */}
      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border border-gray-300 rounded"
        />
      </div>
      
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simulation Controls */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Controls</h4>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isRunning ? '⏸️' : '▶️'}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              🔄
              Reset
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Length: {length.toFixed(2)} m
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Initial Angle: {(initialAngle * 180 / Math.PI).toFixed(1)}°
            </label>
            <input
              type="range"
              min="-1.5"
              max="1.5"
              step="0.1"
              value={initialAngle}
              onChange={(e) => setInitialAngle(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Damping: {damping.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={damping}
              onChange={(e) => setDamping(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Information Display */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">System Properties</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Natural Frequency:</span>
              <span className="font-mono">{naturalFreq.toFixed(2)} rad/s</span>
            </div>
            <div className="flex justify-between">
              <span>Period:</span>
              <span className="font-mono">{period.toFixed(2)} s</span>
            </div>
            <div className="flex justify-between">
              <span>Current Angle:</span>
              <span className="font-mono">{(theta * 180 / Math.PI).toFixed(1)}°</span>
            </div>
            <div className="flex justify-between">
              <span>Angular Velocity:</span>
              <span className="font-mono">{omega.toFixed(2)} rad/s</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-mono">{time.toFixed(1)} s</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Try different lengths to see how period changes. 
              Add damping to see oscillations decay. Large angles show nonlinear behavior!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendulumDemo;
