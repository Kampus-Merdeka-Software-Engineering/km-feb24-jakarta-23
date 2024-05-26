$(document).ready(function(){
  $.getJSON('pizza.json', function(data) {
    var totalRevenue = 0;
    $.each(data, function(index, item) {
      var price = parseFloat(item.price.replace(',', '.'));
      var total_price = parseFloat(item.total_price.replace(',', '.'));
      totalRevenue += price * item.quantity;
    });
    $('#totalRevenue').text('$' + totalRevenue.toFixed(2));
  });
});

$(document).ready(function(){
  $.getJSON('pizza.json', function(data) {
    var totalPizzaSold = 0;
    $.each(data, function(index, item) {
      totalPizzaSold += item.quantity;
    });
    $('#totalPizzasSold').text(totalPizzaSold);
  });
});

$(document).ready(function(){
  $.getJSON('pizza.json', function(data) {
    var uniqueOrderIds = {}; 
    $.each(data, function(index, item) {
      uniqueOrderIds[item.order_id] = true; 
    });
    var totalOrders = Object.keys(uniqueOrderIds).length; 
    $('#totalOrders').text(totalOrders);
  });
});

$(document).ready(function(){
  $.getJSON('pizza.json', function(data) {
    var ordersPerDay = {}; 

    $.each(data, function(index, item) {
      var day = item.day;
      if (!ordersPerDay[day]) {
        ordersPerDay[day] = {};
      }
      ordersPerDay[day][item.order_id] = true; 
    });

    var daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    var labels = daysOfWeek.map(function(day) {
      return ordersPerDay.hasOwnProperty(day) ? day : ''; // Memeriksa apakah ada data untuk hari tersebut
    });
    var data = labels.map(function(label) {
      return label !== '' ? Object.keys(ordersPerDay[label]).length : 0; // Menghitung jumlah order unik per tanggal
    });

    var ctx = document.getElementById('ordersChartPerDay').getContext('2d');
    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Orders per Day',
          data: data,
          backgroundColor: 'blue',
          borderColor: 'blue',
          borderWidth: 0
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  });
});

$(document).ready(function(){
  $.getJSON('pizza.json', function(data) {
    var ordersPerHour = {}; 

    $.each(data, function(index, item) {
      var hour = item.hours;
      if (!ordersPerHour[hour]) {
        ordersPerHour[hour] = {};
      }
      ordersPerHour[hour][item.order_id] = true; 
    });

    var labels = [];
    var data = [];
    for (var hour = 0; hour < 24; hour++) {
      labels.push(hour + ':00'); 
      data.push(ordersPerHour[hour] ? Object.keys(ordersPerHour[hour]).length : 0); // Menghitung jumlah order unik per jam
    }

    var ctx = document.getElementById('ordersLineChartPerHour').getContext('2d');
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Orders per Hour',
          data: data,
          fill: false,
          backgroundColor: 'green',
          borderColor: 'green',
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  });
});

$(document).ready(function(){
  $.getJSON('pizza.json', function(data) {
    var ordersPerMonth = {}; // Objek untuk melacak jumlah order unik per bulan

    // Menghitung jumlah order unik per bulan
    $.each(data, function(index, item) {
      var month = item.month;
      if (!ordersPerMonth[month]) {
        ordersPerMonth[month] = {};
      }
      ordersPerMonth[month][item.order_id] = true; // Menggunakan objek untuk memastikan order_id unik
    });

    // Mengambil label (bulan) dan data (jumlah order) dari objek ordersPerMonth
    var labels = Object.keys(ordersPerMonth);
    var data = labels.map(function(label) {
      return Object.keys(ordersPerMonth[label]).length; // Menghitung jumlah order unik per bulan
    });

    // Membuat diagram garis menggunakan Chart.js
    var ctx = document.getElementById('ordersLineChartPerMonth').getContext('2d');
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Orders per Month',
          data: data,
          fill: false,
          backgroundColor: 'green',
          borderColor: 'green',
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  });
});

$(document).ready(function(){
  $.getJSON('pizza.json', function(data) {
    var salesByCategory = {}; // Objek untuk melacak total penjualan per kategori

    // Menghitung total penjualan per kategori
    $.each(data, function(index, item) {
      var category = item.category;
      if (!salesByCategory[category]) {
        salesByCategory[category] = 0;
      }
      salesByCategory[category] += parseFloat(item.total_price.replace(',', '.')); // Menambahkan total penjualan
    });

    // Menghitung total penjualan keseluruhan
    var totalSales = Object.values(salesByCategory).reduce((a, b) => a + b, 0);

    // Menghitung persentase penjualan masing-masing kategori
    var percentages = {};
    Object.keys(salesByCategory).forEach(function(category) {
      percentages[category] = (salesByCategory[category] / totalSales) * 100;
    });

    // Membuat array label (kategori) dan data (persentase) untuk diagram donut
    var labels = Object.keys(percentages);
    var data = Object.values(percentages);

    // Membuat diagram donut menggunakan Chart.js
    var ctx = document.getElementById('salesDonutChartPerCategory').getContext('2d');
    var chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sales by Category Percentage',
          data: data,
          backgroundColor: ['red', 'yellow', 'green', 'blue', 'purple', 'orange', 'pink'], // Warna background
          borderColor: 'white', // Warna border
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Sales by Category Percentage'
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  });
});

$(document).ready(function(){
  $.getJSON('pizza.json', function(data) {
    var salesBySize = {}; // Objek untuk melacak total penjualan per ukuran

    // Menghitung total penjualan per ukuran
    $.each(data, function(index, item) {
      var size = item.size;
      if (!salesBySize[size]) {
        salesBySize[size] = 0;
      }
      salesBySize[size] += parseFloat(item.total_price.replace(',', '.')); // Menambahkan total penjualan
    });

    // Menghitung total penjualan keseluruhan
    var totalSales = Object.values(salesBySize).reduce((a, b) => a + b, 0);

    // Menghitung persentase penjualan masing-masing ukuran
    var percentages = {};
    Object.keys(salesBySize).forEach(function(size) {
      percentages[size] = (salesBySize[size] / totalSales) * 100;
    });

    // Membuat array label (ukuran) dan data (persentase) untuk diagram donut
    var labels = Object.keys(percentages);
    var data = Object.values(percentages);

    // Membuat diagram donut menggunakan Chart.js
    var ctx = document.getElementById('salesDonutChartPerSize').getContext('2d');
    var chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sales by Size Percentage',
          data: data,
          backgroundColor: ['red', 'yellow', 'green', 'blue', 'purple', 'orange', 'pink'], // Warna background
          borderColor: 'white', // Warna border
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Sales by Size Percentage'
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var label = data.labels[tooltipItem.index];
              var value = data.datasets[0].data[tooltipItem.index];
              return label + ': ' + value;
            }
          }
        }
      }
    });
  });
});

$.getJSON('pizza.json', function(data) {
  // Object untuk melacak total penjualan pizza per kategori
  var pizzaSoldByCategory = {};

  // Hitung total penjualan pizza per kategori
  data.forEach(function(item) {
      var category = item.category;
      if (!pizzaSoldByCategory[category]) {
          pizzaSoldByCategory[category] = 0;
      }
      pizzaSoldByCategory[category] += parseInt(item.quantity);
  });

  // Ekstrak label (kategori) dan data (total penjualan) untuk grafik
  var labels = Object.keys(pizzaSoldByCategory);
  var chartData = Object.values(pizzaSoldByCategory);

  // Buat grafik bar horizontal menggunakan Chart.js
  var ctx = document.getElementById('pizzaSoldByCategoryChart').getContext('2d');
  var chart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: 'Total Penjualan Pizza per Kategori',
              data: chartData,
              backgroundColor: 'blue',
              borderColor: 'blue',
              borderWidth: 0
          }]
      },
      options: {
        indexAxis: 'y',
          scales: {
              xAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
});
  
  // JavaScript for orders.html page
  $(document).ready(function(){
    $.getJSON('pizza.json', function(data) {
      var tableBody = $('#orderTable tbody');
      $.each(data, function(index, item) {
        tableBody.append('<tr><td>' + item.order_id + '</td><td>' + item.date + '</td><td>' + item.time + '</td><td>' + item.name + '</td><td>' + item.quantity + '</td><td>$' + item.total_price + '</td></tr>');
      });
    });
  });

  $(document).ready(function(){
    $.getJSON('pizza.json', function(data) {
      // Menghitung total penjualan untuk setiap jenis pizza
      var pizzaSales = {};
      data.forEach(function(item) {
        var pizzaId = item.name;
        var totalPrice = parseFloat(item.total_price.replace(',', '.'));
        if (pizzaSales[pizzaId]) {
          pizzaSales[pizzaId] += totalPrice;
        } else {
          pizzaSales[pizzaId] = totalPrice;
        }
      });
  
      // Mengurutkan hasil penjualan dari yang tertinggi ke terendah
      var sortedSales = Object.keys(pizzaSales).sort(function(a, b) {
        return pizzaSales[b] - pizzaSales[a];
      });
  
      // Memilih 5 pizza teratas
      var top5Pizzas = sortedSales.slice(0, 5);
  
      // Persiapkan data untuk chart
      var chartLabels = [];
      var chartData = [];
      top5Pizzas.forEach(function(pizzaId) {
        var pizzaName = data.find(function(item) {
          return item.name === pizzaId;
        }).name;
        chartLabels.push(pizzaName);
        chartData.push(pizzaSales[pizzaId]);
      });
  
      // Membuat bar chart
      var ctx = document.getElementById('topPizzaByRevenue').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Total Penjualan',
            data: chartData,
            backgroundColor: [
              'blue'
            ],
            borderColor: [
              'blue'
            ],
            borderWidth: 0
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
  });
  
  $(document).ready(function(){
    $.getJSON('pizza.json', function(data) {
      // Menghitung total quantity untuk setiap jenis pizza
      var pizzaQuantities = {};
      data.forEach(function(item) {
        var pizzaId = item.name;
        var quantity = parseInt(item.quantity);
        if (pizzaQuantities[pizzaId]) {
          pizzaQuantities[pizzaId] += quantity;
        } else {
          pizzaQuantities[pizzaId] = quantity;
        }
      });
  
      // Mengurutkan hasil quantity dari yang tertinggi ke terendah
      var sortedQuantities = Object.keys(pizzaQuantities).sort(function(a, b) {
        return pizzaQuantities[b] - pizzaQuantities[a];
      });
  
      // Memilih 5 pizza teratas
      var top5Pizzas = sortedQuantities.slice(0, 5);
  
      // Persiapkan data untuk chart
      var chartLabels = [];
      var chartData = [];
      top5Pizzas.forEach(function(pizzaId) {
        var pizzaName = data.find(function(item) {
          return item.name === pizzaId;
        }).name;
        chartLabels.push(pizzaName);
        chartData.push(pizzaQuantities[pizzaId]);
      });
  
      // Membuat bar chart
      var ctx = document.getElementById('topPizzaByQuantity').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Total Quantity',
            data: chartData,
            backgroundColor: [
              'blue'
            ],
            borderColor: [
              'blue'
            ],
            borderWidth: 0
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
  });
  
  $(document).ready(function(){
    $.getJSON('pizza.json', function(data) {
      // Menghitung total orders yang berbeda untuk setiap jenis pizza
      var pizzaOrders = {};
      data.forEach(function(item) {
        var pizzaId = item.name;
        var orderId = item.order_id;
        if (pizzaOrders[pizzaId]) {
          if (!pizzaOrders[pizzaId].includes(orderId)) {
            pizzaOrders[pizzaId].push(orderId);
          }
        } else {
          pizzaOrders[pizzaId] = [orderId];
        }
      });
    
      // Mengurutkan pizza-pizza berdasarkan jumlah orders yang berbeda
      var sortedPizzas = Object.keys(pizzaOrders).sort(function(a, b) {
        return pizzaOrders[b].length - pizzaOrders[a].length;
      });
    
      // Memilih 5 pizza teratas
      var top5Pizzas = sortedPizzas.slice(0, 5);
    
      // Persiapkan data untuk chart
      var chartLabels = [];
      var chartData = [];
      top5Pizzas.forEach(function(pizzaId) {
        var pizzaName = pizzaId;
        chartLabels.push(pizzaName);
        chartData.push(pizzaOrders[pizzaId].length);
      });
    
      // Membuat bar chart
      var ctx = document.getElementById('topPizzaByOrders').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Total Orders',
            data: chartData,
            backgroundColor: [
              'blue'
            ],
            borderColor: [
              'blue'
            ],
            borderWidth: 0
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
  });
  
  $(document).ready(function(){
    $.getJSON('pizza.json', function(data) {
      // Menghitung total penjualan untuk setiap jenis pizza
      var pizzaSales = {};
      data.forEach(function(item) {
        var pizzaId = item.name;
        var totalPrice = parseFloat(item.total_price.replace(',', '.'));
        if (pizzaSales[pizzaId]) {
          pizzaSales[pizzaId] += totalPrice;
        } else {
          pizzaSales[pizzaId] = totalPrice;
        }
      });
  
      // Mengurutkan hasil penjualan dari yang tertinggi ke terendah
      var sortedSales = Object.keys(pizzaSales).sort(function(a, b) {
        return pizzaSales[a] - pizzaSales[b];
      });
  
      // Memilih 5 pizza teratas
      var top5Pizzas = sortedSales.slice(0, 5);
  
      // Persiapkan data untuk chart
      var chartLabels = [];
      var chartData = [];
      top5Pizzas.forEach(function(pizzaId) {
        var pizzaName = data.find(function(item) {
          return item.name === pizzaId;
        }).name;
        chartLabels.push(pizzaName);
        chartData.push(pizzaSales[pizzaId]);
      });
  
      // Membuat bar chart
      var ctx = document.getElementById('botPizzaByRevenue').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Total Penjualan',
            data: chartData,
            backgroundColor: [
              'red'
            ],
            borderColor: [
              'red'
            ],
            borderWidth: 0
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
  });
  
  $(document).ready(function(){
    $.getJSON('pizza.json', function(data) {
      // Menghitung total quantity untuk setiap jenis pizza
      var pizzaQuantities = {};
      data.forEach(function(item) {
        var pizzaId = item.name;
        var quantity = parseInt(item.quantity);
        if (pizzaQuantities[pizzaId]) {
          pizzaQuantities[pizzaId] += quantity;
        } else {
          pizzaQuantities[pizzaId] = quantity;
        }
      });
  
      // Mengurutkan hasil quantity dari yang tertinggi ke terendah
      var sortedQuantities = Object.keys(pizzaQuantities).sort(function(a, b) {
        return pizzaQuantities[a] - pizzaQuantities[b];
      });
  
      // Memilih 5 pizza teratas
      var top5Pizzas = sortedQuantities.slice(0, 5);
  
      // Persiapkan data untuk chart
      var chartLabels = [];
      var chartData = [];
      top5Pizzas.forEach(function(pizzaId) {
        var pizzaName = data.find(function(item) {
          return item.name === pizzaId;
        }).name;
        chartLabels.push(pizzaName);
        chartData.push(pizzaQuantities[pizzaId]);
      });
  
      // Membuat bar chart
      var ctx = document.getElementById('botPizzaByQuantity').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Total Quantity',
            data: chartData,
            backgroundColor: [
              'red'
            ],
            borderColor: [
              'red'
            ],
            borderWidth: 0
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
  });
  
  $(document).ready(function(){
    $.getJSON('pizza.json', function(data) {
      // Menghitung total orders yang berbeda untuk setiap jenis pizza
      var pizzaOrders = {};
      data.forEach(function(item) {
        var pizzaId = item.name;
        var orderId = item.order_id;
        if (pizzaOrders[pizzaId]) {
          if (!pizzaOrders[pizzaId].includes(orderId)) {
            pizzaOrders[pizzaId].push(orderId);
          }
        } else {
          pizzaOrders[pizzaId] = [orderId];
        }
      });
    
      // Mengurutkan pizza-pizza berdasarkan jumlah orders yang berbeda
      var sortedPizzas = Object.keys(pizzaOrders).sort(function(a, b) {
        return pizzaOrders[a].length - pizzaOrders[b].length;
      });
    
      // Memilih 5 pizza teratas
      var top5Pizzas = sortedPizzas.slice(0, 5);
    
      // Persiapkan data untuk chart
      var chartLabels = [];
      var chartData = [];
      top5Pizzas.forEach(function(pizzaId) {
        var pizzaName = pizzaId;
        chartLabels.push(pizzaName);
        chartData.push(pizzaOrders[pizzaId].length);
      });
    
      // Membuat bar chart
      var ctx = document.getElementById('botPizzaByOrders').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Total Orders',
            data: chartData,
            backgroundColor: [
              'red'
            ],
            borderColor: [
              'red'
            ],
            borderWidth: 0
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
  });
