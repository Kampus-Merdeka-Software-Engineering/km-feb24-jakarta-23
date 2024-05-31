let calculateTotalRevenue = () => {
  fetch('pizza.json')
    .then(response => response.json())
    .then(data => {
      let totalRevenue = 0;
      data.forEach(item => {
        let price = parseFloat(item.price.replace(',', '.'));
        totalRevenue += price * item.quantity;
      });
      document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toFixed(2);
    })
    .catch(error => console.error('Error:', error));
};
document.addEventListener('DOMContentLoaded', calculateTotalRevenue);

let calculateTotalOrders = () => {
  fetch('pizza.json')
    .then(response => response.json())
    .then(data => {
      let uniqueOrderIds = {};
      data.forEach(item => {
        uniqueOrderIds[item.order_id] = true;
      });
      let totalOrders = Object.keys(uniqueOrderIds).length;
      document.getElementById('totalOrders').textContent = totalOrders;
    })
    .catch(error => console.error('Error:', error));
};
document.addEventListener('DOMContentLoaded', calculateTotalOrders);

let calculateTotalPizzasSold = () => {
  fetch('pizza.json')
    .then(response => response.json())
    .then(data => {
      let totalPizzaSold = 0;
      data.forEach(item => {
        totalPizzaSold += item.quantity;
      });
      document.getElementById('totalPizzasSold').textContent = totalPizzaSold;
    })
    .catch(error => console.error('Error:', error));
};
document.addEventListener('DOMContentLoaded', calculateTotalPizzasSold);

    
let drawOrdersPerDayChart = () => {
  fetch('pizza.json')
    .then(response => response.json())
    .then(data => {
      let ordersPerDay = {};

      data.forEach(item => {
        let day = item.day;
        if (!ordersPerDay[day]) {
          ordersPerDay[day] = {};
        }
        ordersPerDay[day][item.order_id] = true;
      });

      let daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

      let labels = daysOfWeek.map(day => ordersPerDay.hasOwnProperty(day) ? day : '');
      let dataPoints = labels.map(label => label !== '' ? Object.keys(ordersPerDay[label]).length : 0);

      let ctx = document.getElementById('ordersPerDay').getContext('2d');
      let chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: "Total Orders",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.5)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: dataPoints,
          }],
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
    })
    .catch(error => console.error('Error:', error));
};
document.addEventListener('DOMContentLoaded', drawOrdersPerDayChart);

fetch('pizza.json')
  .then(response => response.json())
  .then(data => {
    let pizzaSoldByCategory = {};

    data.forEach(item => {
      let category = item.category;
      if (!pizzaSoldByCategory[category]) {
        pizzaSoldByCategory[category] = 0;
      }
      pizzaSoldByCategory[category] += parseInt(item.quantity);
    });

    let labels = Object.keys(pizzaSoldByCategory);
    let chartData = Object.values(pizzaSoldByCategory);

    let ctx = document.getElementById('pizzaSoldByCategory').getContext('2d');
    let chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "Total Sold",
          backgroundColor: "#4e73df",
          hoverBackgroundColor: "#2e59d9",
          borderColor: "#4e73df",
          data: chartData,
        }],
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
  })
  .catch(error => console.error('Error:', error));
  
  document.addEventListener("DOMContentLoaded", function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                var salesBySize = {};

                data.forEach(function(item) {
                    var size = item.size;
                    if (!salesBySize[size]) {
                        salesBySize[size] = 0;
                    }
                    salesBySize[size] += parseFloat(item.total_price.replace(',', '.'));
                });

                var totalSales = Object.values(salesBySize).reduce((a, b) => a + b, 0);

                var percentages = {};
                Object.keys(salesBySize).forEach(function(size) {
                    percentages[size] = (salesBySize[size] / totalSales) * 100;
                });

                var labels = Object.keys(percentages);
                var data = Object.values(percentages);

                var ctx = document.getElementById('salesDonutChartPerSize').getContext('2d');
                var chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Sales by Size Percentage',
                            data: data,
                            backgroundColor: ['#4e73df', '#ff6b6b', '#ffd166', '#45aaf2', '#50bfa9'],
                            hoverBorderColor: "rgba(234, 236, 244, 1)",
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
                    }
                });
            } else {
                console.error('Failed to fetch data: ' + xhr.status);
            }
        }
    };
    xhr.open('GET', 'pizza.json');
    xhr.send();
});
  
  
    document.addEventListener("DOMContentLoaded", function() {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                  var data = JSON.parse(xhr.responseText);
                  console.log(data); 
  
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
  
                  var sortedSales = Object.keys(pizzaSales).sort(function(a, b) {
                      return pizzaSales[b] - pizzaSales[a];
                  });
  
                  var top5Pizzas = sortedSales.slice(0, 5);
  
                  var chartLabels = [];
                  var chartData = [];
                  top5Pizzas.forEach(function(pizzaId) {
                      var pizzaName = data.find(function(item) {
                          return item.name === pizzaId;
                      }).name;
                      chartLabels.push(pizzaName);
                      chartData.push(pizzaSales[pizzaId]);
                  });
  
                  var ctx = document.getElementById('topPizzaByRevenue').getContext('2d');
                  var myChart = new Chart(ctx, {
                      type: 'bar',
                      data: {
                          labels: chartLabels,
                          datasets: [{
                              label: 'Total Revenue',
                              data: chartData,
                              backgroundColor: "#4e73df",
                              hoverBackgroundColor: "#2e59d9",
                              borderColor: "#4e73df",
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
                          },
                      }
                  });
              } else {
                  console.error('Failed to fetch data: ' + xhr.status);
              }
          }
      };
      xhr.open('GET', 'pizza.json');
      xhr.send();
  });
  
      
  document.addEventListener("DOMContentLoaded", function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
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

                var sortedSales = Object.keys(pizzaSales).sort(function(a, b) {
                    return pizzaSales[a] - pizzaSales[b];
                });

                var bottom5Pizzas = sortedSales.slice(0, 5);

                var chartLabels = [];
                var chartData = [];
                bottom5Pizzas.forEach(function(pizzaId) {
                    var pizzaName = data.find(function(item) {
                        return item.name === pizzaId;
                    }).name;
                    chartLabels.push(pizzaName);
                    chartData.push(pizzaSales[pizzaId]);
                });

                var ctx = document.getElementById('bottomPizzaByRevenue').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            label: 'Total Revenue',
                            data: chartData,
                            backgroundColor: "#4e73df",
                            hoverBackgroundColor: "#2e59d9",
                            borderColor: "#4e73df",
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
                        },
                    }
                });
            } else {
                console.error('Failed to fetch data: ' + xhr.status);
            }
        }
    };
    xhr.open('GET', 'pizza.json');
    xhr.send();
});


document.addEventListener("DOMContentLoaded", function () {
  var currentPage = 1;
  var itemsPerPage = 10;
  var jsonData;
  var uniqueItems;

  function loadData() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'pizza.json', true);
      xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
              jsonData = JSON.parse(xhr.responseText);
              uniqueItems = getUniqueItems(jsonData);
              renderTable(uniqueItems);
          }
      };
      xhr.send();
  }

  function getUniqueItems(data) {
      var uniqueItems = {};
      data.forEach(function (item) {
          var key = item.name + item.size + item.price;
          if (!uniqueItems[key]) {
              uniqueItems[key] = item;
          }
      });
      return Object.values(uniqueItems);
  }

  function renderTable(data) {
      data.sort(function (a, b) {
          var nameA = a.name.toUpperCase();
          var nameB = b.name.toUpperCase();
          if (nameA < nameB) {
              return -1;
          }
          if (nameA > nameB) {
              return 1;
          }
          return 0;
      });

      var startIndex = (currentPage - 1) * itemsPerPage;
      var endIndex = startIndex + itemsPerPage;
      var tableBody = document.getElementById('orderTable').getElementsByTagName('tbody')[0];
      tableBody.innerHTML = '';

      for (var i = startIndex; i < endIndex && i < data.length; i++) {
          var item = data[i];
          var row = tableBody.insertRow();
          row.innerHTML = '<td>' + (i + 1) + '</td><td>' + item.name + '</td><td>' + item.size + '</td><td>$' + item.price + '</td>';
      }

      renderPagination(data.length);
  }

  function renderPagination(totalItems) {
      var totalPages = Math.ceil(totalItems / itemsPerPage);
      var paginationList = document.querySelectorAll('.pagination')[0];
      paginationList.innerHTML = '';

      paginationList.insertAdjacentHTML('beforeend', '<li class="page-item ' + (currentPage === 1 ? 'disabled' : '') + '"><a class="page-link" href="#" onclick="prevPage()">Previous</a></li>');

      for (var i = 1; i <= totalPages; i++) {
          paginationList.insertAdjacentHTML('beforeend', '<li class="page-item ' + (currentPage === i ? 'active' : '') + '"><a class="page-link" href="#" onclick="changePage(' + i + ')">' + i + '</a></li>');
      }

      paginationList.insertAdjacentHTML('beforeend', '<li class="page-item ' + (currentPage === totalPages ? 'disabled' : '') + '"><a class="page-link" href="#" onclick="nextPage()">Next</a></li>');
  }

  window.changePage = function (page) {
      currentPage = page;
      renderTable(uniqueItems);
  }

  window.prevPage = function () {
      if (currentPage > 1) {
          currentPage--;
          renderTable(uniqueItems);
      }
  }

  window.nextPage = function () {
      var totalPages = Math.ceil(uniqueItems.length / itemsPerPage);
      if (currentPage < totalPages) {
          currentPage++;
          renderTable(uniqueItems);
      }
  }

  loadData();
});

(function () {
  "use strict";

  document.getElementById('sidebarToggle').addEventListener('click', function (e) {
      document.body.classList.toggle('sidebar-toggled');
      var sidebar = document.querySelector('.sidebar');
      sidebar.classList.toggle('toggled');
      if (sidebar.classList.contains('toggled')) {
          var collapses = sidebar.querySelectorAll('.collapse');
          collapses.forEach(function (collapse) {
              collapse.classList.remove('show');
          });
      }
  });

  window.addEventListener('resize', function () {
      if (window.innerWidth < 768) {
          var collapses = document.querySelectorAll('.sidebar .collapse');
          collapses.forEach(function (collapse) {
              collapse.classList.remove('show');
          });
      }
  });

  var sidebar = document.querySelector('body.fixed-nav .sidebar');
  sidebar.addEventListener('wheel', function (e) {
      if (window.innerWidth > 768) {
          var delta = e.deltaY || e.detail || e.wheelDelta;
          this.scrollTop += (delta < 0 ? 1 : -1) * 30;
          e.preventDefault();
      }
  });

  window.addEventListener('scroll', function () {
      var scrollDistance = document.documentElement.scrollTop || document.body.scrollTop;
      var scrollToTopButton = document.querySelector('.scroll-to-top');
      if (scrollDistance > 100) {
          scrollToTopButton.style.display = 'block';
      } else {
          scrollToTopButton.style.display = 'none';
      }
  });

  document.querySelectorAll('a.scroll-to-top').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          var target = document.querySelector(anchor.getAttribute('href'));
          target.scrollIntoView({
              behavior: 'smooth'
          });
      });
  });
})();

(function () {
  var modalBtns = document.querySelectorAll("#myBtn, #modalLong, #modalScroll, #modalCenter");
  modalBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
          document.querySelector('.modal').classList.toggle('show');
      });
  });
})();

(function () {
  var popovers = document.querySelectorAll('[data-toggle="popover"]');
  popovers.forEach(function (popover) {
      new bootstrap.Popover(popover);
  });

  var popoverDismiss = document.querySelectorAll('.popover-dismiss');
  popoverDismiss.forEach(function (dismiss) {
      new bootstrap.Popover(dismiss, {
          trigger: 'focus'
      });
  });
})();

document.addEventListener('DOMContentLoaded', function () {
    const monthFilterSelect = document.getElementById('monthFilter');

    // Fetch JSON data
    fetch('pizza.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Extract unique months from data
        const uniqueMonths = [...new Set(data.map(item => item.month))];

        // Populate select element with unique months
        uniqueMonths.forEach(month => {
          const option = document.createElement('option');
          option.value = month;
          option.textContent = month;
          monthFilterSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  });


  document.addEventListener("DOMContentLoaded", function() {
    const sidebarToggle = document.querySelector("#sidebarToggle");
    const sidebar = document.querySelector("#sidebar");
    sidebarToggle.addEventListener("click", function() {
    sidebar.classList.toggle("toggled");
    });
  });
  