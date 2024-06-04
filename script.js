document.addEventListener('DOMContentLoaded', function () {
    const monthFilterSelect = document.getElementById('monthFilter');
    const totalRevenueElement = document.getElementById('totalRevenue');
    const totalOrdersElement = document.getElementById('totalOrders');
    const totalPizzasSoldElement = document.getElementById('totalPizzasSold');
    let chartInstances = {}; // Objek untuk menyimpan instance dari setiap chart
    let allData = []; // Menyimpan data asli sebelum disaring

    // Fetch JSON data
    fetch('pizza.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allData = data; // Menyimpan data asli
            // Extract unique months from data
            const uniqueMonths = ['All', ...new Set(data.map(item => item.month))];

            // Populate select element with unique months
            uniqueMonths.forEach(month => {
                const option = document.createElement('option');
                option.value = month;
                option.textContent = month;
                monthFilterSelect.appendChild(option);
            });

            // Menggambar semua grafik awal dengan semua data
            drawAllCharts(data);

            // Menambahkan event listener untuk perubahan pilihan bulan
            monthFilterSelect.addEventListener('change', function () {
                const selectedMonth = this.value; // Mendapatkan nilai bulan yang dipilih
                let filteredData = []; // Menyimpan data yang akan digunakan untuk menggambar grafik

                if (selectedMonth === 'All') {
                    filteredData = allData; // Jika memilih "All", gunakan data asli
                } else {
                    filteredData = allData.filter(item => item.month === selectedMonth); // Jika tidak, saring data berdasarkan bulan yang dipilih
                }

                // Memanggil fungsi untuk menggambar ulang semua grafik dengan data yang disaring
                Object.keys(chartInstances).forEach(chartId => {
                    drawChart(chartId, filteredData);
                });

                // Calculate and display total revenue, total orders, and total pizza sold for the selected month
                const totalRevenue = filteredData.reduce((total, item) => total + parseFloat(item.total_price.replace(',', '.')), 0);
                const uniqueOrders = new Set(filteredData.map(item => item.order_id)); // Mendapatkan ID pesanan yang unik
                const totalOrders = uniqueOrders.size; // Menghitung jumlah pesanan yang unik
                const totalPizzaSold = filteredData.reduce((total, item) => total + parseInt(item.quantity), 0);
                
                // Update HTML elements with calculated values
                totalRevenueElement.textContent = `$${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
                totalOrdersElement.textContent = totalOrders.toLocaleString();
                totalPizzasSoldElement.textContent = totalPizzaSold.toLocaleString();
            });

            // Display initial totals when page is loaded
            displayTotals(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Fungsi untuk menggambar semua grafik berdasarkan data yang diberikan
    function drawAllCharts(data) {
        // Menggambar grafik "Orders Per Day"
        drawChart('ordersPerDay', data);

        // Menggambar grafik "Pizza Sold By Category"
        drawChart('pizzaSoldByCategory', data);

        // Menggambar grafik "Sales Donut Chart Per Size"
        drawChart('salesDonutChartPerSize', data);

        // Menggambar grafik "Top Pizza By Revenue"
        drawChart('topPizzaByRevenue', data);

        // Menggambar grafik "Bottom Pizza By Revenue"
        drawChart('bottomPizzaByRevenue', data);
    }

    // Fungsi untuk menggambar grafik berdasarkan ID chart dan data yang diberikan
    function drawChart(chartId, data) {
        let chartData = {};

        // Logika pengolahan data untuk setiap chart
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

        // Menghapus chart lama jika sudah ada
        if (chartInstances[chartId] !== undefined && chartInstances[chartId] !== null) {
            chartInstances[chartId].destroy();
        }

        // Menggambar chart baru dengan data yang telah diproses
        let ctx = document.getElementById(chartId).getContext('2d');
        chartInstances[chartId] = new Chart(ctx, chartData);
    }

    // Fungsi untuk menampilkan total revenue, total orders, dan total pizza sold
    function displayTotals(data) {
        const totalRevenue = data.reduce((total, item) => total + parseFloat(item.total_price.replace(',', '.')), 0);
        const uniqueOrders = new Set(data.map(item => item.order_id)); // Mendapatkan ID pesanan yang unik
        const totalOrders = uniqueOrders.size; // Menghitung jumlah pesanan yang unik
        const totalPizzaSold = data.reduce((total, item) => total + parseInt(item.quantity), 0);

        // Update HTML elements with calculated values
        totalRevenueElement.textContent = `$${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        totalOrdersElement.textContent = totalOrders.toLocaleString();
        totalPizzasSoldElement.textContent = totalPizzaSold.toLocaleString();
    }

    // Fungsi untuk menggambar grafik "Orders Per Day"
    function drawOrdersPerDayChart(data) {
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

        return {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Total Orders",
                    data: dataPoints,
                    backgroundColor: "rgba(78, 115, 223, 0.5)",
                    borderColor: "rgba(78, 115, 223, 1)",
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

    // Fungsi untuk menggambar grafik "Pizza Sold By Category"
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
                    backgroundColor: "#4e73df",
                    hoverBackgroundColor: "#2e59d9",
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

    // Fungsi untuk menggambar grafik "Sales Donut Chart Per Size"
    function drawSalesDonutChartPerSize(data) {
        let salesBySize = {};

        // Menghitung total penjualan per ukuran
        data.forEach(function (item) {
            let size = item.size;
            if (!salesBySize[size]) {
                salesBySize[size] = 0;
            }
            salesBySize[size] += parseFloat(item.total_price.replace(',', '.'));
        });

        // Menghitung total penjualan keseluruhan
        let totalSales = Object.values(salesBySize).reduce((a, b) => a + b, 0);

        // Menghitung persentase penjualan per ukuran
        let percentages = {};
        Object.keys(salesBySize).forEach(function (size) {
            percentages[size] = ((salesBySize[size] / totalSales) * 100).toFixed(2); // Mengubah persentase menjadi string dengan tambahan tanda persen
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
                    backgroundColor: ['#4e73df', '#ff6b6b', '#ffd166', '#45aaf2', '#50bfa9'],
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
                                    label += value + '%'; // Menambahkan persentase ke label tooltip
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
                    enabled: true // Mengaktifkan tooltip
                }
            }
        };
    }

    // Fungsi untuk menggambar grafik "Top Pizza By Revenue"
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
                    backgroundColor: "#4e73df",
                    hoverBackgroundColor: "#2e59d9",
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
                                return '$' + value.toLocaleString(); // Tambahkan tanda dollar di sini
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
                                    label += '$' + value.toLocaleString(); // Menambahkan tanda dollar ke label tooltip
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        };
    }

    // Fungsi untuk menggambar grafik "Bottom Pizza By Revenue"
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
                    backgroundColor: "#4e73df",
                    hoverBackgroundColor: "#2e59d9",
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
                                return '$' + value.toLocaleString(); // Tambahkan tanda dollar di sini
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
                                    label += '$' + value.toLocaleString(); // Menambahkan tanda dollar ke label tooltip
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

    // Add event listener for search input
    var table = document.getElementById("orderTable").getElementsByTagName('tbody')[0];
    document.getElementById("searchInput").addEventListener("keyup", function() {
        var query = this.value.trim().toLowerCase();
        var filteredData = jsonData.filter(function(item) {
            return item.name.toLowerCase().includes(query) || item.size.toLowerCase().includes(query) || item.price.toString().includes(query);
        });
        uniqueItems = getUniqueItems(filteredData);
        currentPage = 1;
        renderTable(uniqueItems);
    });
  
    loadData();
});

document.addEventListener("DOMContentLoaded", function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const contentWrapper = document.getElementById('content-wrapper');
  
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      contentWrapper.classList.toggle('collapsed');
    });
  });
  