import React, { useState, useEffect, useRef } from 'react';

const SpringMassDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const positionHistoryRef = useRef<number[]>([]);
  
  // Simulation parameters
  const [isRunning, setIsRunning] = useState(false);
  const [mass, setMass] = useState(1.0);
  const [springConstant, setSpringConstant] = useState(10.0);
  const [dampingCoeff, setDampingCoeff] = useState(0.5);
  const [initialPosition, setInitialPosition] = useState(0.1);
  const [forcingAmplitude, setForcingAmplitude] = useState(0.0);
  const [forcingFrequency, setForcingFrequency] = useState(1.0);
  
  // Simulation state
  const [position, setPosition] = useState(0.1);
  const [velocity, setVelocity] = useState(0.0);
  const [time, setTime] = useState(0);
  const [energy, setEnergy] = useState(0);
  
  // Constants
  const dt = 0.016; // ~60 FPS
  const scale = 200; // pixels per meter
  const centerX = 200;
  const centerY = 150;
  const equilibriumX = 300;
  
  // Reset simulation
  const reset = () => {
    setIsRunning(false);
    setPosition(initialPosition);
    setVelocity(0);
    setTime(0);
    setEnergy(0);
    positionHistoryRef.current = [];
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
  
  // Physics update
  const updatePhysics = () => {
    if (!isRunning) return;
    
    // External forcing function
    const externalForce = forcingAmplitude * Math.cos(forcingFrequency * time);
    
    // Spring-mass-damper equation: ma = -kx - cv + F_external
    const acceleration = (-springConstant * position - dampingCoeff * velocity + externalForce) / mass;
    
    const newVelocity = velocity + acceleration * dt;
    const newPosition = position + newVelocity * dt;
    const newTime = time + dt;
    
    // Calculate total energy (kinetic + potential)
    const kineticEnergy = 0.5 * mass * newVelocity * newVelocity;
    const potentialEnergy = 0.5 * springConstant * newPosition * newPosition;
    const totalEnergy = kineticEnergy + potentialEnergy;
    
    setVelocity(newVelocity);
    setPosition(newPosition);
    setTime(newTime);
    setEnergy(totalEnergy);
    
    // Store position history for trail effect
    positionHistoryRef.current.push(newPosition);
    if (positionHistoryRef.current.length > 50) {
      positionHistoryRef.current.shift();
    }
  };
  
  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        updatePhysics();
        drawSystem();
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
  }, [isRunning, position, velocity, mass, springConstant, dampingCoeff, forcingAmplitude, forcingFrequency]);
  
  // Draw the spring-mass system
  const drawSystem = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate mass position
    const massX = equilibriumX + position * scale;
    
    // Draw wall
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(50, 100, 20, 100);
    
    // Draw wall hatching
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const y = 110 + i * 10;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(50, y + 10);
      ctx.stroke();
    }
    
    // Draw spring (dynamic length based on mass position)
    const springStartX = 70;
    const springEndX = massX - 30;
    const springLength = springEndX - springStartX;
    const coils = 8;
    const coilWidth = springLength / coils;
    
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(springStartX, centerY);
    
    for (let i = 0; i < coils; i++) {
      const x1 = springStartX + i * coilWidth + coilWidth/4;
      const x2 = springStartX + i * coilWidth + 3*coilWidth/4;
      const y1 = centerY + (i % 2 === 0 ? -15 : 15);
      const y2 = centerY + (i % 2 === 0 ? 15 : -15);
      
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.lineTo(springEndX, centerY);
    ctx.stroke();
    
    // Draw mass
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.fillRect(massX - 30, centerY - 25, 60, 50);
    ctx.strokeRect(massX - 30, centerY - 25, 60, 50);
    
    // Mass label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('m', massX, centerY + 5);
    
    // Draw position history (trail)
    if (positionHistoryRef.current.length > 1) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      positionHistoryRef.current.forEach((pos, index) => {
        const x = equilibriumX + pos * scale;
        const y = centerY + 80;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }
    
    // Draw equilibrium line
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(equilibriumX, 50);
    ctx.lineTo(equilibriumX, 250);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Equilibrium label
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Equilibrium', equilibriumX, 40);
    
    // Draw displacement arrow
    if (Math.abs(position) > 0.01) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(equilibriumX, centerY + 60);
      ctx.lineTo(massX, centerY + 60);
      ctx.stroke();
      
      // Arrow head
      const arrowSize = 8;
      const direction = position > 0 ? 1 : -1;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(massX, centerY + 60);
      ctx.lineTo(massX - direction * arrowSize, centerY + 60 - arrowSize/2);
      ctx.lineTo(massX - direction * arrowSize, centerY + 60 + arrowSize/2);
      ctx.closePath();
      ctx.fill();
      
      // Displacement label
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('x', (equilibriumX + massX) / 2, centerY + 80);
    }
    
    // External force indicator
    if (Math.abs(forcingAmplitude) > 0.01) {
      const forceValue = forcingAmplitude * Math.cos(forcingFrequency * time);
      const forceX = massX + 40;
      const forceLength = Math.abs(forceValue) * 30;
      
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(forceX, centerY);
      ctx.lineTo(forceX + (forceValue > 0 ? forceLength : -forceLength), centerY);
      ctx.stroke();
      
      // Force arrow
      const dir = forceValue > 0 ? 1 : -1;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(forceX + dir * forceLength, centerY);
      ctx.lineTo(forceX + dir * forceLength - dir * 10, centerY - 5);
      ctx.lineTo(forceX + dir * forceLength - dir * 10, centerY + 5);
      ctx.closePath();
      ctx.fill();
      
      // Force label
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('F(t)', forceX + dir * forceLength/2, centerY - 15);
    }
  };
  
  // Initial draw
  useEffect(() => {
    drawSystem();
  }, [position, mass, springConstant]);
  
  const naturalFreq = Math.sqrt(springConstant / mass);
  const dampingRatio = dampingCoeff / (2 * Math.sqrt(springConstant * mass));
  const dampedFreq = naturalFreq * Math.sqrt(Math.max(0, 1 - dampingRatio * dampingRatio));
  
  const getBehaviorType = () => {
    if (dampingRatio < 1) return 'Underdamped';
    if (dampingRatio === 1) return 'Critically Damped';
    return 'Overdamped';
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center">Interactive Spring-Mass System</h3>
      
      {/* Canvas */}
      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          width={500}
          height={300}
          className="border border-gray-300 rounded"
        />
      </div>
      
      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              Mass: {mass.toFixed(1)} kg
            </label>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={mass}
              onChange={(e) => setMass(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Spring Constant: {springConstant.toFixed(1)} N/m
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={springConstant}
              onChange={(e) => setSpringConstant(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Damping: {dampingCoeff.toFixed(2)} N⋅s/m
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={dampingCoeff}
              onChange={(e) => setDampingCoeff(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Initial Position: {initialPosition.toFixed(2)} m
            </label>
            <input
              type="range"
              min="-0.3"
              max="0.3"
              step="0.01"
              value={initialPosition}
              onChange={(e) => setInitialPosition(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Forcing Function */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            ⚡
            External Force
          </h4>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Force Amplitude: {forcingAmplitude.toFixed(1)} N
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={forcingAmplitude}
              onChange={(e) => setForcingAmplitude(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Force Frequency: {forcingFrequency.toFixed(1)} rad/s
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={forcingFrequency}
              onChange={(e) => setForcingFrequency(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="text-sm text-gray-600">
            <p>F(t) = {forcingAmplitude.toFixed(1)} × cos({forcingFrequency.toFixed(1)}t)</p>
            {forcingAmplitude > 0 && (
              <p className="mt-2">
                Frequency Ratio: {(forcingFrequency / naturalFreq).toFixed(2)}
                {Math.abs(forcingFrequency / naturalFreq - 1) < 0.1 && (
                  <span className="text-red-600 font-bold"> (Near Resonance!)</span>
                )}
              </p>
            )}
          </div>
        </div>
        
        {/* System Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">System Properties</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Natural Frequency:</span>
              <span className="font-mono">{naturalFreq.toFixed(2)} rad/s</span>
            </div>
            <div className="flex justify-between">
              <span>Damping Ratio:</span>
              <span className="font-mono">{dampingRatio.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span>Behavior:</span>
              <span className="font-mono">{getBehaviorType()}</span>
            </div>
            {dampingRatio < 1 && (
              <div className="flex justify-between">
                <span>Damped Frequency:</span>
                <span className="font-mono">{dampedFreq.toFixed(2)} rad/s</span>
              </div>
            )}
          </div>
          
          <div className="border-t pt-3">
            <h5 className="font-medium mb-2">Current State</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Position:</span>
                <span className="font-mono">{position.toFixed(3)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Velocity:</span>
                <span className="font-mono">{velocity.toFixed(3)} m/s</span>
              </div>
              <div className="flex justify-between">
                <span>Energy:</span>
                <span className="font-mono">{energy.toFixed(3)} J</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-mono">{time.toFixed(1)} s</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded">
            <p className="text-sm text-green-800">
              <strong>Try this:</strong> Set damping to 0 for pure oscillation, 
              or match forcing frequency to natural frequency for resonance!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpringMassDemo;
