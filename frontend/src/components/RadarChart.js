/**
 * RadarChart Component
 */
export class RadarChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.chart = null;
    this.isDarkMode = this.detectDarkMode();
  }

  /**
   * Detect dark mode
   */
  detectDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Create radar chart
   */
  createChart(scoresData) {
    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }

    // Destroy existing chart
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = {
      empathy: 'Empatia',
      problemSolving: 'Resolução',
      communication: 'Comunicação',
      toneOfVoice: 'Tom de Voz',
      efficiency: 'Eficiência'
    };
    
    const chartLabels = Object.keys(scoresData).map(key => labels[key] || key);
    const chartData = Object.keys(scoresData).map(key => scoresData[key].score);

    const colors = this.getColors();

    this.chart = new Chart(this.canvas.getContext('2d'), {
      type: 'radar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Pontuação do Candidato',
          data: chartData,
          backgroundColor: colors.background,
          borderColor: colors.border,
          pointBackgroundColor: colors.pointBackground,
          pointBorderColor: colors.pointBorder,
          pointHoverBackgroundColor: colors.pointHoverBackground,
          pointHoverBorderColor: colors.pointHoverBorder,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            angleLines: {
              color: colors.angleLines
            },
            grid: {
              color: colors.grid
            },
            pointLabels: {
              color: colors.pointLabels,
              font: {
                size: 12,
                family: 'Inter, sans-serif'
              }
            },
            ticks: {
              color: colors.ticks,
              backdropColor: 'transparent',
              stepSize: 2,
              font: {
                family: 'Inter, sans-serif'
              }
            },
            min: 0,
            max: 10
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  /**
   * Get colors based on theme
   */
  getColors() {
    const isDark = this.isDarkMode;
    
    return {
      background: 'rgba(79, 70, 229, 0.2)',
      border: 'rgba(79, 70, 229, 1)',
      pointBackground: 'rgba(79, 70, 229, 1)',
      pointBorder: '#fff',
      pointHoverBackground: '#fff',
      pointHoverBorder: 'rgba(79, 70, 229, 1)',
      grid: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      angleLines: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      pointLabels: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
      ticks: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
    };
  }

  /**
   * Update chart data
   */
  updateChart(scoresData) {
    if (!this.chart) {
      this.createChart(scoresData);
      return;
    }

    const chartData = Object.keys(scoresData).map(key => scoresData[key].score);
    this.chart.data.datasets[0].data = chartData;
    this.chart.update();
  }

  /**
   * Destroy chart
   */
  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  /**
   * Resize chart
   */
  resize() {
    if (this.chart) {
      this.chart.resize();
    }
  }
}
