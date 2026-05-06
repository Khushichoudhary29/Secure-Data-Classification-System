// charts.js - Chart.js wrappers (FIXED)

// Chart.js CDN loaded in HTML
// FIXED: Removed early destructuring from window.api - now using lazy access

// Store chart instances per canvas
const chartInstances = {};

window.charts = {
  // Initialize chart instance on a canvas
  init(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.warn('Canvas not found:', canvasId);
      return null;
    }
    // Destroy existing chart if any
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }
    return new Chart(canvas, {
      type: 'pie', // default is pie
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e2e8f0' }
          }
        },
        scales: {
          y: {
            ticks: { color: '#e2e8f0' }
          },
          x: {
            ticks: { color: '#e2e8f0' }
          }
        }
      }
    });
  },
  
  // Render pie chart - creates new chart each time
  renderPieChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('Canvas not found for pie chart:', canvasId);
      return;
    }
    // Destroy existing chart
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }
    const ctx = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: ['#22c55e', '#3b82f6', '#10b981', '#ef4444', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e2e8f0' }
          }
        }
      }
    });
    chartInstances[canvasId] = ctx;
  },
  
  // Render bar chart
  renderBarChart(canvasId, data, labels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('Canvas not found for bar chart:', canvasId);
      return;
    }
    // Destroy existing chart
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }
    const ctx = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Uploads',
          data,
          backgroundColor: 'rgba(56, 189, 248, 0.6)',
          borderColor: '#38bdf8',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { color: '#e2e8f0' } },
          x: { ticks: { color: '#e2e8f0' } }
        },
        plugins: { legend: { labels: { color: '#e2e8f0' } } }
      }
    });
    chartInstances[canvasId] = ctx;
  },
  
  // Render line chart
  renderLineChart(canvasId, data, labels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('Canvas not found for line chart:', canvasId);
      return;
    }
    // Destroy existing chart
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }
    const ctx = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Growth',
          data,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { color: '#e2e8f0' } },
          x: { ticks: { color: '#e2e8f0' } }
        },
        plugins: { legend: { labels: { color: '#e2e8f0' } } }
      }
    });
    chartInstances[canvasId] = ctx;
  }
};

// Auto init charts when DOM is ready - but don't pre-create charts
// Let each dashboard create charts when needed
document.addEventListener('DOMContentLoaded', () => {
  console.log('charts.js initialized');
});
