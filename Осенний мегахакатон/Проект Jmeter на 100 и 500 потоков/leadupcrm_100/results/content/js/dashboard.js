/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9960120139098351, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.99657424074145, 500, 1500, "HTTP Request Clients"], "isController": false}, {"data": [0.9965412105380084, 500, 1500, "HTTP Request Products"], "isController": false}, {"data": [0.9942493738079371, 500, 1500, "HTTP Request Tasks"], "isController": false}, {"data": [0.9965705422794118, 500, 1500, "HTTP Request Contacts"], "isController": false}, {"data": [0.9966712378092225, 500, 1500, "HTTP Request Cloud"], "isController": false}, {"data": [0.9967592042812213, 500, 1500, "HTTP Request Users"], "isController": false}, {"data": [0.9965088666743268, 500, 1500, "HTTP Request Companies"], "isController": false}, {"data": [0.9942481197248901, 500, 1500, "HTTP Request Events"], "isController": false}, {"data": [0.9943711767477315, 500, 1500, "HTTP Request Communications"], "isController": false}, {"data": [0.9966844288828192, 500, 1500, "HTTP Request Settings"], "isController": false}, {"data": [0.9964223880368334, 500, 1500, "HTTP Request Categories"], "isController": false}, {"data": [0.9965438140974089, 500, 1500, "HTTP Request Deals"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3133035, 0, 0.0, 113.89581827205109, 31, 10927, 104.0, 227.0, 285.0, 349.0, 870.2381865027648, 777.5629774859633, 116.42811649093356], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request Clients", 261110, 0, 0.0, 111.58046034238347, 32, 5369, 71.0, 174.0, 216.0, 321.0, 72.54298861777143, 64.80693509658461, 9.492930151153685], "isController": false}, {"data": ["HTTP Request Products", 261074, 0, 0.0, 111.74799865172179, 31, 5600, 71.0, 176.0, 219.0, 322.9900000000016, 72.54048403853169, 64.81888954614892, 10.413526517250157], "isController": false}, {"data": ["HTTP Request Tasks", 261102, 0, 0.0, 120.11126303130655, 32, 6026, 72.0, 192.0, 241.0, 413.9900000000016, 72.5393351324951, 64.81786293577443, 9.350773669423196], "isController": false}, {"data": ["HTTP Request Contacts", 261120, 0, 0.0, 111.90736443014771, 33, 5185, 71.0, 172.0, 213.0, 318.0, 72.54395296200306, 64.82198921897734, 9.563900048701575], "isController": false}, {"data": ["HTTP Request Cloud", 261058, 0, 0.0, 111.56295152801503, 33, 5949, 71.0, 174.0, 215.0, 320.9900000000016, 72.54238757594418, 64.82059046092668, 9.351167148461554], "isController": false}, {"data": ["HTTP Request Users", 261047, 0, 0.0, 111.34146341463457, 34, 5402, 71.0, 173.0, 215.95000000000073, 319.0, 72.541770006183, 64.82003862857172, 9.351087539859527], "isController": false}, {"data": ["HTTP Request Companies", 261090, 0, 0.0, 112.12797502776729, 32, 5525, 71.0, 173.0, 216.0, 322.0, 72.54101947513409, 64.81936798803486, 9.634354149041247], "isController": false}, {"data": ["HTTP Request Events", 261132, 0, 0.0, 120.42939969058007, 32, 5948, 73.0, 192.0, 241.0, 378.9800000000032, 72.53517566583353, 64.8141462248415, 9.42107262066002], "isController": false}, {"data": ["HTTP Request Communications", 261067, 0, 0.0, 120.36054346202562, 33, 10927, 72.0, 192.90000000000146, 244.0, 419.9900000000016, 72.54065541028301, 64.81904267618063, 9.988508215673736], "isController": false}, {"data": ["HTTP Request Settings", 261041, 0, 0.0, 111.59566887960158, 34, 5595, 71.0, 176.0, 213.0, 316.0, 72.5415339263205, 64.80571862510435, 9.988629183214053], "isController": false}, {"data": ["HTTP Request Categories", 261068, 0, 0.0, 111.91301883034339, 31, 5402, 71.0, 175.0, 217.0, 320.9900000000016, 72.5424450328454, 64.80649468405504, 10.555492490130822], "isController": false}, {"data": ["HTTP Request Deals", 261126, 0, 0.0, 112.0701653607823, 32, 5598, 71.0, 174.0, 217.95000000000073, 318.0, 72.54271773913725, 64.82088547979549, 9.35120970856066], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3133035, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
