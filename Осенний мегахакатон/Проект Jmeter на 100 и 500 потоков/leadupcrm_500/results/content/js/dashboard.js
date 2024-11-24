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

    var data = {"OkPercent": 99.08616684820409, "KoPercent": 0.9138331517959082};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.88346970512198, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9111111111111111, 500, 1500, "HTTP Request Clients"], "isController": false}, {"data": [0.9215974234597455, 500, 1500, "HTTP Request Products"], "isController": false}, {"data": [0.9158441169988351, 500, 1500, "HTTP Request Tasks"], "isController": false}, {"data": [0.9035143619155515, 500, 1500, "HTTP Request Contacts"], "isController": false}, {"data": [0.9245854089160729, 500, 1500, "HTTP Request Cloud"], "isController": false}, {"data": [0.9257155247181267, 500, 1500, "HTTP Request Users"], "isController": false}, {"data": [0.9198480494429792, 500, 1500, "HTTP Request Companies"], "isController": false}, {"data": [0.5180653779663681, 500, 1500, "HTTP Request Events"], "isController": false}, {"data": [0.9227956819793555, 500, 1500, "HTTP Request Communications"], "isController": false}, {"data": [0.9228870434775751, 500, 1500, "HTTP Request Settings"], "isController": false}, {"data": [0.9214041554431895, 500, 1500, "HTTP Request Categories"], "isController": false}, {"data": [0.8951534885915858, 500, 1500, "HTTP Request Deals"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1524020, 13927, 0.9138331517959082, 379.7907015656008, 8, 148462, 144.0, 396.0, 572.9500000000007, 812.9700000000048, 1269.3312278036526, 1151.7907641071738, 168.30070941379157], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request Clients", 127080, 1465, 1.1528171230720805, 322.768995908087, 8, 18458, 209.0, 503.0, 630.0, 945.9900000000016, 105.90670742480357, 96.47672379927812, 13.699117936323468], "isController": false}, {"data": ["HTTP Request Products", 126992, 456, 0.35907773718029484, 317.0556334257235, 8, 140279, 212.0, 496.0, 623.0, 928.0, 105.84624822258785, 95.15599253049314, 15.140164211629152], "isController": false}, {"data": ["HTTP Request Tasks", 127044, 976, 0.7682377758886685, 322.0072966846111, 10, 139789, 216.0, 505.90000000000146, 649.0, 1084.9900000000016, 105.88094103057315, 95.83980904589308, 13.543860469748541], "isController": false}, {"data": ["HTTP Request Contacts", 127107, 2108, 1.658445246917951, 331.3292737614747, 8, 20598, 210.0, 534.0, 654.0, 963.0, 105.92488330987447, 97.3026377142965, 13.733109287927729], "isController": false}, {"data": ["HTTP Request Cloud", 126872, 128, 0.10088908506210985, 311.89704584147876, 11, 137302, 211.0, 492.0, 627.9500000000007, 951.0, 105.76139165692736, 94.6654291466323, 13.619549877209684], "isController": false}, {"data": ["HTTP Request Users", 126830, 105, 0.08278798391547741, 311.35409603407055, 9, 15797, 211.0, 502.0, 644.0, 942.9800000000032, 105.73069891634995, 94.60831490812858, 13.61806444483255], "isController": false}, {"data": ["HTTP Request Companies", 127015, 669, 0.5267094437664843, 316.76909813802206, 8, 137672, 211.0, 500.0, 629.9500000000007, 916.0, 105.860742054506, 95.43550348835586, 13.985576406177204], "isController": false}, {"data": ["HTTP Request Events", 127260, 4501, 3.536853685368537, 1035.0025381109301, 8, 148462, 677.0, 1313.0, 1849.9000000000015, 3867.9900000000016, 105.99276390748996, 100.41704676740186, 13.279732427562035], "isController": false}, {"data": ["HTTP Request Communications", 126910, 186, 0.14656055472382004, 312.3314632416689, 14, 15315, 209.0, 503.0, 648.0, 931.9700000000048, 105.7878657791967, 94.7619035835004, 14.545144503882334], "isController": false}, {"data": ["HTTP Request Settings", 126801, 69, 0.054415974637423994, 312.5459657258229, 14, 16910, 212.0, 512.0, 639.0, 946.9900000000016, 105.70996016733388, 94.54447682970368, 14.547845337668964], "isController": false}, {"data": ["HTTP Request Categories", 126966, 272, 0.21423058141549706, 319.52652678670114, 18, 138019, 219.0, 508.0, 653.0, 1060.0, 105.82845864166556, 94.90771430896349, 15.365878433781988], "isController": false}, {"data": ["HTTP Request Deals", 127143, 2992, 2.353255782858671, 343.37103104378366, 8, 138496, 211.0, 509.0, 641.0, 953.9900000000016, 105.95055757311115, 98.44187199015936, 13.336288704498752], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 39, 0.28003159330796296, 0.0025590215351504572], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 1, 0.007180297264306743, 6.561593679872968E-5], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to sf.leadupcrm.pro:443 [sf.leadupcrm.pro/89.111.174.200] failed: Connection timed out: connect", 3, 0.021540891792920226, 1.9684781039618903E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 13834, 99.33223235441947, 0.9077308696736264], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Попытка установить соединение была безуспешной, т.к. от другого компьютера за требуемое время не получен нужный отклик, или было разорвано уже установленное соединение из-за неверного отклика уже подключенного компьютера", 50, 0.3590148632153371, 0.003280796839936484], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1524020, 13927, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 13834, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Попытка установить соединение была безуспешной, т.к. от другого компьютера за требуемое время не получен нужный отклик, или было разорвано уже установленное соединение из-за неверного отклика уже подключенного компьютера", 50, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 39, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to sf.leadupcrm.pro:443 [sf.leadupcrm.pro/89.111.174.200] failed: Connection timed out: connect", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HTTP Request Clients", 127080, 1465, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1465, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request Products", 126992, 456, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 452, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Попытка установить соединение была безуспешной, т.к. от другого компьютера за требуемое время не получен нужный отклик, или было разорвано уже установленное соединение из-за неверного отклика уже подключенного компьютера", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": ["HTTP Request Tasks", 127044, 976, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 974, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Попытка установить соединение была безуспешной, т.к. от другого компьютера за требуемое время не получен нужный отклик, или было разорвано уже установленное соединение из-за неверного отклика уже подключенного компьютера", 1, "", "", "", ""], "isController": false}, {"data": ["HTTP Request Contacts", 127107, 2108, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2107, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Попытка установить соединение была безуспешной, т.к. от другого компьютера за требуемое время не получен нужный отклик, или было разорвано уже установленное соединение из-за неверного отклика уже подключенного компьютера", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request Cloud", 126872, 128, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 127, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Попытка установить соединение была безуспешной, т.к. от другого компьютера за требуемое время не получен нужный отклик, или было разорвано уже установленное соединение из-за неверного отклика уже подключенного компьютера", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request Users", 126830, 105, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 105, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request Companies", 127015, 669, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 667, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Попытка установить соединение была безуспешной, т.к. от другого компьютера за требуемое время не получен нужный отклик, или было разорвано уже установленное соединение из-за неверного отклика уже подключенного компьютера", 1, "", "", "", ""], "isController": false}, {"data": ["HTTP Request Events", 127260, 4501, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4430, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Попытка установить соединение была безуспешной, т.к. от другого компьютера за требуемое время не получен нужный отклик, или было разорвано уже установленное соединение из-за неверного отклика уже подключенного компьютера", 38, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to sf.leadupcrm.pro:443 [sf.leadupcrm.pro/89.111.174.200] failed: Connection timed out: connect", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 1], "isController": false}, {"data": ["HTTP Request Communications", 126910, 186, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 185, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request Settings", 126801, 69, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 69, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request Categories", 126966, 272, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 269, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Попытка установить соединение была безуспешной, т.к. от другого компьютера за требуемое время не получен нужный отклик, или было разорвано уже установленное соединение из-за неверного отклика уже подключенного компьютера", 1, "", "", "", ""], "isController": false}, {"data": ["HTTP Request Deals", 127143, 2992, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2984, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Попытка установить соединение была безуспешной, т.к. от другого компьютера за требуемое время не получен нужный отклик, или было разорвано уже установленное соединение из-за неверного отклика уже подключенного компьютера", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to sf.leadupcrm.pro:443 [sf.leadupcrm.pro/89.111.174.200] failed: Connection timed out: connect", 1, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
