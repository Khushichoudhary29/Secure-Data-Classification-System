// charts.js - Chart.js wrappers

// Chart.js CDN loaded in HTML
const { roleMap } = window.api;

window.charts = {
  init(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    return new Chart(canvas, {
      type: 'pie', // default
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
  
  renderPieChart(canvasId, data) {
    const ctx = this.init(canvasId);
    ctx.data = {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: ['#22c55e', '#3b82f6', '#10b981', '#ef4444', '#f59e0b']
      }]
    };
    ctx.update();
  },
  
  renderBarChart(canvasId, data, labels) {
    const ctx = new Chart(document.getElementById(canvasId), {
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
  },
  
  renderLineChart(canvasId, data, labels) {
    const ctx = new Chart(document.getElementById(canvasId), {
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
  }
};

// Auto init charts on DOM load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('canvas[id]').forEach(canvas => {
    if (!canvas.chart) {
      canvas.chart = window.charts.init(canvas.id);
    }
  });
});
