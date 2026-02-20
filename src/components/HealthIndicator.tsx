"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function HealthIndicator() {
  const [health, setHealth] = useState({ healthy: true, lastCheck: null });
  
  useEffect(() => {
    // Check health every 30 seconds
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        setHealth(data);
      } catch (e) {
        setHealth({ healthy: false, lastCheck: null });
      }
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (health.healthy) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-500">
        <CheckCircle className="w-4 h-4" />
        <span>System Operational</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-red-500 animate-pulse">
      <AlertTriangle className="w-4 h-4" />
      <span>System Down!</span>
    </div>
  );
}
