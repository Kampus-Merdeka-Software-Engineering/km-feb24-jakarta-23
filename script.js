document.addEventListener('DOMContentLoaded', function () {
    const monthFilterSelect = document.getElementById('monthFilter');
    const totalRevenueElement = document.getElementById('totalRevenue');
    const totalOrdersElement = document.getElementById('totalOrders');
    const totalPizzasSoldElement = document.getElementById('totalPizzasSold');
    let chartInstances = {}; 
    let allData = []; 

    fetch('pizza.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allData = data; 
            const uniqueMonths = ['All', ...new Set(data.map(item => item.month))];

            uniqueMonths.forEach(month => {
                const option = document.createElement('option');
                option.value = month;
                option.textContent = month;
                monthFilterSelect.appendChild(option);
            });

            drawAllCharts(data);

            monthFilterSelect.addEventListener('change', function () {
                const selectedMonth = this.value; 
                let filteredData = []; 

                if (selectedMonth === 'All') {
                    filteredData = allData; 
                    document.querySelectorAll('.text-xs span').forEach(span => {
                        span.textContent = 'Jan - Dec 2015';
                    });
                } else {
                    filteredData = allData.filter(item => item.month === selectedMonth); 
                    document.querySelectorAll('.text-xs span').forEach(span => {
                        span.textContent = selectedMonth + ' 2015';
                    });
                }

                Object.keys(chartInstances).forEach(chartId => {
                    drawChart(chartId, filteredData);
                });

                const totalRevenue = filteredData.reduce((total, item) => total + parseFloat(item.total_price.replace(',', '.')), 0);
                const uniqueOrders = new Set(filteredData.map(item => item.order_id));
                const totalOrders = uniqueOrders.size; 
                const totalPizzaSold = filteredData.reduce((total, item) => total + parseInt(item.quantity), 0);
                
                totalRevenueElement.textContent = `$${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
                totalOrdersElement.textContent = totalOrders.toLocaleString();
                totalPizzasSoldElement.textContent = totalPizzaSold.toLocaleString();

            });

            displayTotals(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    function drawAllCharts(data) {
        drawChart('ordersPerDay', data);
        drawChart('pizzaSoldByCategory', data);
        drawChart('salesDonutChartPerSize', data);
        drawChart('topPizzaByRevenue', data);
        drawChart('bottomPizzaByRevenue', data);
    }

    function drawChart(chartId, data) {
        let chartData = {};

        switch (chartId) {
            case 'ordersPerDay':
                chartData = drawOrdersPerDayChart(data);
                break;
            case 'pizzaSoldByCategory':
                chartData = drawPizzaSoldByCategoryChart(data);
                break;
            case 'salesDonutChartPerSize':
                chartData = drawSalesDonutChartPerSize(data);
                break;
            case 'topPizzaByRevenue':
                chartData = drawTopPizzaByRevenueChart(data);
                break;
            case 'bottomPizzaByRevenue':
                chartData = drawBottomPizzaByRevenueChart(data);
                break;
            default:
                console.error('Invalid chart ID');
                break;
        }

        if (chartInstances[chartId] !== undefined && chartInstances[chartId] !== null) {
            chartInstances[chartId].destroy();
        }

        let ctx = document.getElementById(chartId).getContext('2d');
        chartInstances[chartId] = new Chart(ctx, chartData);
    }

    function displayTotals(data) {
        const totalRevenue = data.reduce((total, item) => total + parseFloat(item.total_price.replace(',', '.')), 0);
        const uniqueOrders = new Set(data.map(item => item.order_id)); 
        const totalOrders = uniqueOrders.size; 
        const totalPizzaSold = data.reduce((total, item) => total + parseInt(item.quantity), 0);

        totalRevenueElement.textContent = `$${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        totalOrdersElement.textContent = totalOrders.toLocaleString();
        totalPizzasSoldElement.textContent = totalPizzaSold.toLocaleString();
    }

    function drawOrdersPerDayChart(data) {
        let ordersPerDay = {};

        data.forEach(item => {
            let day = item.day;
            if (!ordersPerDay[day]) {
                ordersPerDay[day] = {};
            }
            ordersPerDay[day][item.order_id] = true;
        });

        let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        let labels = daysOfWeek.map(day => ordersPerDay.hasOwnProperty(day) ? day : '');
        let dataPoints = labels.map(label => label !== '' ? Object.keys(ordersPerDay[label]).length : 0);

        return {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Total Orders",
                    data: dataPoints,
                    backgroundColor: "#DD5746",
                    borderColor: "#DD5746",
                    borderWidth: 2,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
    }

    function drawPizzaSoldByCategoryChart(data) {
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

        return {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: "Total Sold",
                    data: chartData,
                    backgroundColor: "#4793AF",
                    borderWidth: 1,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
    }

    function drawSalesDonutChartPerSize(data) {
        let salesBySize = {};

        data.forEach(function (item) {
            let size = item.size;
            if (!salesBySize[size]) {
                salesBySize[size] = 0;
            }
            salesBySize[size] += parseFloat(item.total_price.replace(',', '.'));
        });

        let totalSales = Object.values(salesBySize).reduce((a, b) => a + b, 0);

        let percentages = {};
        Object.keys(salesBySize).forEach(function (size) {
            percentages[size] = ((salesBySize[size] / totalSales) * 100).toFixed(2); 
        });

        let labels = Object.keys(percentages);
        let chartData = Object.values(percentages);

        return {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales by Size',
                    data: chartData,
                    backgroundColor: ['#4793AF', '#FFC470', '#DD5746', '#557C55', '#45aaf2', '#8B322C'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                let value = context.raw || '';
                                if (value) {
                                    label += value + '%'; 
                                }
                                return label;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                tooltips: {
                    enabled: true 
                }
            }
        };
    }

    function drawTopPizzaByRevenueChart(data) {
        let pizzaSales = {};

        data.forEach(function (item) {
            let pizzaId = item.name;
            let totalPrice = parseFloat(item.total_price.replace(',', '.'));
            if (pizzaSales[pizzaId]) {
                pizzaSales[pizzaId] += totalPrice;
            } else {
                pizzaSales[pizzaId] = totalPrice;
            }
        });

        let sortedSales = Object.keys(pizzaSales).sort(function (a, b) {
            return pizzaSales[b] - pizzaSales[a];
        });

        let top5Pizzas = sortedSales.slice(0, 5);

        let chartLabels = [];
        let chartData = [];
        top5Pizzas.forEach(function (pizzaId) {
            let pizzaName = data.find(function (item) {
                return item.name === pizzaId;
            }).name;
            chartLabels.push(pizzaName);
            chartData.push(pizzaSales[pizzaId]);
        });

        return {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Total Revenue',
                    data: chartData,
                    backgroundColor: "#FFC470",
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value, index, values) {
                                return '$' + value.toLocaleString(); 
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                let value = context.formattedValue || '';
                                if (value) {
                                    label += '$' + value.toLocaleString(); 
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        };
    }

    function drawBottomPizzaByRevenueChart(data) {
        let pizzaSales = {};

        data.forEach(function (item) {
            let pizzaId = item.name;
            let totalPrice = parseFloat(item.total_price.replace(',', '.'));
            if (pizzaSales[pizzaId]) {
                pizzaSales[pizzaId] += totalPrice;
            } else {
                pizzaSales[pizzaId] = totalPrice;
            }
        });

        let sortedSales = Object.keys(pizzaSales).sort(function (a, b) {
            return pizzaSales[a] - pizzaSales[b];
        });

        let bottom5Pizzas = sortedSales.slice(0, 5);

        let chartLabels = [];
        let chartData = [];
        bottom5Pizzas.forEach(function (pizzaId) {
            let pizzaName = data.find(function (item) {
                return item.name === pizzaId;
            }).name;
            chartLabels.push(pizzaName);
            chartData.push(pizzaSales[pizzaId]);
        });

        return {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Total Revenue',
                    data: chartData,
                    backgroundColor: "#557C55",
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value, index, values) {
                                return '$' + value.toLocaleString(); 
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                let value = context.formattedValue || '';
                                if (value) {
                                    label += '$' + value.toLocaleString(); 
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        };
    }
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

        var startPage = Math.max(1, currentPage - 0);
        var endPage = Math.min(totalPages, currentPage + 0);

        if (startPage > 1) {
            paginationList.insertAdjacentHTML('beforeend', '<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>');
            if (startPage > 2) {
                paginationList.insertAdjacentHTML('beforeend', '<li class="page-item"><span class="page-link">...</span></li>');
            }
        }

        for (var i = startPage; i <= endPage; i++) {
            paginationList.insertAdjacentHTML('beforeend', '<li class="page-item ' + (currentPage === i ? 'active' : '') + '"><a class="page-link" href="#" onclick="changePage(' + i + ')">' + i + '</a></li>');
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationList.insertAdjacentHTML('beforeend', '<li class="page-item"><span class="page-link">...</span></li>');
            }
            paginationList.insertAdjacentHTML('beforeend', '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + totalPages + ')">' + totalPages + '</a></li>');
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

    var table = document.getElementById("orderTable").getElementsByTagName('tbody')[0];
    document.getElementById("searchInput").addEventListener("keyup", function () {
        var query = this.value.trim().toLowerCase();
        var filteredData = jsonData.filter(function (item) {
            return item.name.toLowerCase().includes(query) || item.size.toLowerCase().includes(query) || item.price.toString().includes(query);
        });
        uniqueItems = getUniqueItems(filteredData);
        currentPage = 1;
        renderTable(uniqueItems);
    });

    function setItemsPerPage(count) {
        itemsPerPage = count;
        renderTable(uniqueItems);
    }

    var dropdown = document.getElementById('itemsPerPageDropdown');
    dropdown.addEventListener('change', function (event) {
    var count = parseInt(event.target.value);
    setItemsPerPage(count);
});

    loadData();
});

var sortColumn = 0; 
var sortOrder = 'asc'; 

function sortTable(column) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("orderTable");
    switching = true;
    
    if (sortColumn === column) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortOrder = 'asc';
    }
    
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[column];
            y = rows[i + 1].getElementsByTagName("TD")[column];
            if (sortOrder === 'asc') {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    renderSortIcon(column, sortOrder);
    updateRowNumbers(); 
}

function updateRowNumbers() {
    var table = document.getElementById("orderTable");
    var rows = table.rows;
    for (var i = 1; i < rows.length; i++) {
        rows[i].querySelector('td:first-child').textContent = i;
    }
}

function renderSortIcon(column, sortOrder) {
    var headers = document.querySelectorAll('.table th');
    headers.forEach(header => {
        var icon = header.querySelector('.sort-icon');
        if (icon) {
            icon.parentNode.removeChild(icon);
        }
        header.classList.remove('sort-hover');
    });
    
    var icon = sortOrder === 'asc' ? '&#9650;' : '&#9660;';
    var header = document.getElementById(column === 1 ? 'nameHeader' : (column === 2 ? 'sizeHeader' : 'priceHeader'));
    header.insertAdjacentHTML('beforeend', '<span class="sort-icon">' + icon + '</span>');

    header.classList.add('sort-hover');
}

document.addEventListener("DOMContentLoaded", function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const contentWrapper = document.getElementById('content-wrapper');
  
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      contentWrapper.classList.toggle('collapsed');
    });
  
    document.getElementById("formToggle").addEventListener("click", function() {
      document.getElementById("formContainer").classList.toggle("visible");
    });
  
    document.getElementById("contactForm").addEventListener("submit", function(event) {
      event.preventDefault();
      let formData = new FormData(this);
  
      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          displayAlert("Message sent successfully!", true);
          document.getElementById("contactForm").reset();
          document.getElementById("formContainer").classList.remove("visible");
        } else {
          displayAlert("Failed to send message. Please try again later.", false);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        displayAlert("Failed to send message. Please try again later.", false);
      });
    });
  
    function displayAlert(message, isSuccess) {
      const alertBox = document.getElementById("customAlert");
      const alertMessage = document.getElementById("alertMessage");
  
      alertBox.style.display = "block";
      alertMessage.textContent = message;
  
      if (isSuccess) {
        alertBox.classList.add("alert-success");
        alertBox.classList.remove("alert-failed");
      } else {
        alertBox.classList.add("alert-failed");
        alertBox.classList.remove("alert-success");
      }
    }
  
    document.getElementById("closeAlert").addEventListener("click", function() {
      document.getElementById("customAlert").style.display = "none";
    });
  });