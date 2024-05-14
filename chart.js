google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Month');
      data.addColumn('number', 'Total Orders');
      data.addColumn('number', 'Total Quantity');
      data.addColumn('number', 'Total Revenue');

      data.addRows([
        [1, 1845, 4232, 69793.30],
        [2, 1685,	3961, 65159.60],
        [3, 1840, 4261, 70397.10],
        [4, 1799, 4151, 68736.80],
        [5, 1853, 4328, 71402.75],
        [6, 1773, 4107, 68230.20],
        [7, 1935, 4392, 72557.90],
        [8, 1841, 4168, 68278.25],
        [9, 1661, 3890, 64180.05],
        [10, 1646, 3883, 64027.60],
        [11, 1792, 4266, 70395.35],
        [12, 1680, 3935, 64701.15]
      ]);

      var options = {
        chart: {
          title: 'Total Orders & Revenue',
          subtitle: '2015'
        },
        width: 900,
        height: 500,
        axes: {
          x: {
            0: {side: 'top'}
          }
        }
      };

      var chart = new google.charts.Line(document.getElementById('line_top_x'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }