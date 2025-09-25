export function parseMetrics(metrics: string): Record<string, any> {
    const result: Record<string, any> = {};
    const lines = metrics.split('\n');
  
    lines.forEach((line) => {
      if (line.startsWith('#') || line.trim() === '') return; // Skip comments and empty lines
      const [key, value] = line.split(' ');
      if (key && value) {
        result[key] = parseFloat(value);
      }
    });
  
    return result;
  }