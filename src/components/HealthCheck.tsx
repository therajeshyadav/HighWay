import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

const HealthCheck = () => {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await apiService.healthCheck();
        setStatus(isHealthy ? 'healthy' : 'unhealthy');
      } catch (error) {
        console.error('Health check failed:', error);
        setStatus('unhealthy');
      }
    };

    checkHealth();
  }, []);

  const statusConfig = {
    checking: { color: 'text-yellow-600', text: 'Checking...' },
    healthy: { color: 'text-green-600', text: 'Backend Connected' },
    unhealthy: { color: 'text-red-600', text: 'Backend Disconnected' }
  };

  const config = statusConfig[status];

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg px-3 py-2 shadow-lg">
      <div className={`text-sm font-medium ${config.color}`}>
        <span className="inline-block w-2 h-2 rounded-full bg-current mr-2"></span>
        {config.text}
      </div>
    </div>
  );
};

export default HealthCheck;