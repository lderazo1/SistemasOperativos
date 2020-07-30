var $resultsArea,
    resultCollections = 0,
    individualAlgorithms = true; 

$(document).ready(function(){
    $resultsArea = $("#page-replace-visualizer .dataContainer");
        
    // Execute FIFO button
    $("#run-fifo").click(function(){
        if (validatePageData()){
            runFifo();
        }
    });
    
    // Execute LRU button
    $("#run-lru").click(function(){
        if (validatePageData()){
            runLru();
        }
    });
    
    // Execute Random button
    $("#run-random").click(function(){
        if (validatePageData()){
            runRandom();
        }
    });
    
    // Execute Optimal button
    $("#run-optimal").click(function(){
        if (validatePageData()){
            runOptimal();
        }
    });

    // Execute Nfu button
    $("#run-nfu").click(function(){
        if (validatePageData()){
            runNfu();
        }
    });
    
    // Execute Mru button
    $("#run-mru").click(function(){
        if (validatePageData()){
            runMru();
        }
    });
    
    // Execute Second chance button
    $("#run-second-chance").click(function(){
        if (validatePageData()){
            runSecondChance();
        }
    });
    
    // Execute Clock button
    $("#run-clock").click(function(){
        if (validatePageData()){
            runClock();
        }
    });
    
    // Execute Gclock button
    $("#run-gclock").click(function(){
        if (validatePageData()){
            runGClock();
        }
    });
    
    // Execute Aging button
    $("#run-aging").click(function(){
        if (validatePageData()){
            runAging();
        }
    });

    // Reset Everyting: clear tables and graph button
    $("#clear-all").click(function(){
            clearAll();
    });


    // Execute Random data button
    $("#rnd-gen").click(function(){
        randomizeInput();
    });
    
    //Test all algortihms n times button
    $("#test-all").click(function(){
        if (validatePageData()){
            setTimeout(function(){
                showSpinner();
                setProgressBar(0);
            },0);
            // Get how many times to execute
            var times = parseInt($('#execute-times').val());
            // Hardcoded limits 0 - 200 times
            if (times < 0) {
                times = 0;
            }
            else if (times > 200) {
                times = 200;    // should have some upper limit as well for safety :)
            }
            
            individualAlgorithms = false;
            
            if (times === 0) {
                $('#results-wrap').hide();
            }
            
            createNewCollection('All algorithms', times);
            
            setTimeout(function(){
                // I set to execute 0 times, do nothing and return
                if (times === 0){
                    hideSpinner();
                    setProgressBar(100);
                    return 0;
                }
                for (var i=1; i <= times; i++){
                    setTimeout(function(i){
                    randomizeInput();

                    runAllAlgos();

                    setProgressBar((i/times)*100);
                    if (i == times){
                        setTimeout(function(){
                            hideSpinner();
                        },0);
                    individualAlgorithms = true;
                    formatTables();
                    }
                },0,i);
            }
            },10);
        }
    });

    // Run all with input data provided
    $("#run-all").click(function(){
        if (validatePageData()){
            runAllAlgos();
        }
    });
    
    // showHideButton for collections
    $('body').on('click', '.showHideButton', function(){
        if ($(this).text() === 'Hide') {
            $(this).parent().siblings().hide();
            $(this).text('Show');
        } else {
            $(this).parent().siblings().show();
            $(this).text('Hide');
        }
    });
});    

var faultData = {
    'fifo':[],
    'aging':[],
    'secondChance':[],
    'clock':[],
    'clockPro':[],
    'wsclock':[],
    'car':[],
    'lru':[],
    'nfu':[],
    'mru':[],
    'random':[],
    'optimal':[],
    'gclock':[]
};

// Randomize input data
function randomizeInput(){
    var lengthMin = parseInt($('#rnd-page-length-min').val());
    var lengthMax = parseInt($('#rnd-page-length-max').val());
    var bufferMin = $('#rnd-buffer-min').val();
    var bufferMax = $('#rnd-buffer-max').val();
    genRandomData(getRandomInteger(lengthMin,lengthMax));
    genRandomBufferSize(bufferMin,bufferMax);
}

// Check if page-data-input is in valid format
function validatePageData(){
    var valid = /^((([0-9]+),)+[0-9]+)$/.test($('#page-data-input').val());
    if (!valid){
        spawnPageValidationError();
    }
    else{
        despawnPageValidationError();
    }
    return valid;
}

// Execute all made algorithms
function runAllAlgos(){
    runFifo();
    runLru();
    runRandom();
    runOptimal();
    runNfu();
    runMru();
    runSecondChance();
    runClock();
    runGClock();
    runAging();
    // TODO add all other algorithms
}

// Create new collection (HTML container) for results
function createNewCollection(algorithm, executionsCount) {
    resultCollections++;
    var htmlContents = '<div class="collection collection' + resultCollections + '"><div class="buttonContainer"><button class="showHideButton">Hide</button><span class="details">';

    htmlContents += '</span></div></div>';
    $resultsArea.append(htmlContents);
}

// Make show/hide button visible for each collection, if there are several of them
function processCollections() {
    var collections = $('.collection');
    if (collections.length > 1) {
        $('.showHideButton').show();
    }
}



// Get average page faults
function getAveragePageFault(algo){
    if (faultData[algo].length == 0){
        return 0;
    }
    var sum = 0;
    for (var i in faultData[algo]){
        sum += parseInt(faultData[algo][i]);
    }
    return sum/faultData[algo].length;
}

function showSpinner(){
    $('#spinner').show();
}

function hideSpinner(){
    $('#spinner').hide();
}

function updateChart(){

    chartData[getLabelIndex('Optimal')].y = getAveragePageFault('optimal');
    chartData[getLabelIndex('Optimal')].toolTipContent = "{label}: {y} page faults \n"+faultData['optimal'].length+" executions";
    
    // Order data
    chartData.sort(compareChartColumns);
    for (var i in chartData){
        chartData[i].x = parseInt(i);
    }
    
    faultChart.render();
}

// Get chart index from chart label
function getLabelIndex(label){
    for (var i in chartData){
        if (chartData[i].label == label){
            return i;
        }
    }
    return -1;
}

// Helper comparison function for sorting chart columns
function compareChartColumns(first,second){
    if (first.y < second.y){
        return -1;
    }
    if (first.y == second.y){
        return 0;
    }
    if (first.y > second.y){
        return 1;
    }
}


function formatTables() {
    $('table').each(function() {
        var $frames = $(this).find('.frame');
        if ($frames.length > 1) {
            $frames.each(function(index) {
                if (index === 0) {
                    $(this).attr('rowspan', $frames.length);
                } else {
                    $(this).remove();
                }
            });
        }
    });
}




// Run Optimal algo
function runOptimal(){
    // Read input data
        var data = $('#page-data-input').val().split(',').map(Number);
        var buffSize = parseInt($('#buffer-size-input').val());
        
        // Mesure execution time
        var Start = new Date(); 
        var results = optimal(data,buffSize);
        var End = new Date();
        
        // Return if erros where found
        if(results == null){
            console.log("Error in Optimal");
            return;
        }

        // Add data to array
        faultData['optimal'].push(results.pageFaults);
        
        // Append and display results
        $("#results-wrap").show();
        var $collection = $resultsArea.children('.collection' + resultCollections);
        $collection.append("<h4>Fallos : "+results.pageFaults+" fallos página!</h4>");
        $collection.append("<h4>Tiempo Ejecución: " + (End-Start)/1000 + "s</h4>");
        $collection.append("<hr>");
        processCollections();
        
        // Update chart
        updateChart();
}



function renderBuffer(page, buffer, bs){
    var table = $("#page-replace-visualizer tbody").last();
    var i = -2; // index for buffer (escape 1.row)
    table.children("tr").each(function(){
        $this = $(this);
        var content = $this.html();
        var existingColumns = $this.children().length;
        // Add heading row
        if(i === -2){
            if ($this.children("th").length === 0) {
                content += "<th class='firstColumn'></th>";
                existingColumns = 1;
            }
            content+="<th>Tiempo " + existingColumns + "</th>";
            $this.html(content);
            i++;
            return;
        }
        // Add page number (1.row)
        if(i === -1){
            if ($this.children("td").length === 0) {
                content += "<td class='firstColumn'>Páginas</td>";
            }
            content+="<td>"+page+"</td>";
            $this.html(content);
            i++;
            return;
        }
        // Add F/H identifier (last row)
        if(i === bs){
            if ($this.children("td").length === 0) {
                content += "<td class='firstColumn'>Estado</td>";
            }
            if(buffer.pageFaultIdx == -1){
                content += "<td class=\"green\">Existe</td>";
            }else{
                content += "<td class=\"red\">Fallo</td>";
            }
            $this.html(content);
            i++;
            return;
        }
        // Add page buffer (2.row -> last row-1)
        if(i > buffer.data.length - 1){
            if ($this.children("td").length === 0) {
                content += "<td class='frame firstColumn'>Marco Pag.</td>";
            }
            content += "<td></td>";
            $this.html(content);
            i++;
            return;
        }
        // Add red class for page fault
        if(buffer.pageFaultIdx === i){
            if ($this.children("td").length === 0) {
                content += "<td class='frame firstColumn'>Marco Pag.</td>";
            }
            content += "<td class=\"red\">"+buffer.data[i]+"</td>";
            $this.html(content);
            i++;
            return;
        }
        content+="<td>"+buffer.data[i]+"</td>"
        $this.html(content);
        i++;
    })
}

// Initialize new render area 
function renderBufferInit(bs){
    // Make new table and initialize with empty rows
    var $collection = $resultsArea.children('.collection' + resultCollections);
    $collection.append("<table><tbody></tbody></table>");
    var table = $("#page-replace-visualizer tbody").last();
    var data = "";
    for (var i = 0; i <= bs+2; i++){
        data += "<tr></tr>";
    }
    table.append(data);
}


// Find page in history using page number
function findPage(page, history){
    for (var i = 0; i < history.length; i++){
        if(history[i].page==page){
            return i;
        }
    }
    return -1;
}

// Copy data from history objects to buffer array for easier rendering 
function updateBuffer(buffer,history,pageFaultIdx){
    for (var i = 0; i < history.length; i++){
        buffer.data[i]=history[i].page;
    }
    buffer.pageFaultIdx = pageFaultIdx;
}

// Fing oldest indes in history object
function findOldestIndex(history){
    var index = null;// index of oldest element
    var sAge = null; // smallest age

    // Abort if there is no elements in history
    if(history.length<1){
        return -1;
    }

    index = 0;
    sAge = history[0].age;
    for (var i = 1; i < history.length; i++){
        if(history[i].age<sAge){
            sAge = history[i].age;
            index = i;
        }
    }
    return index;
}



// Fing oldest indes in history object
function findOptimalPageToReplace(data, history){
    var index = null;// index of element to replace
    var notUsedTheLongest = 0;

    // Abort if there is no elements in history
    if(history.length<1){
        return -1;
    }
    
    for (var i = 0; i < history.length; i++)
    {
        var currElem = history[i].page;
        var elemFound = false;
        for (var j = 0; j < data.length; j++)
        {
            if(currElem == data[j])
            {
                elemFound = true;
                if(notUsedTheLongest < j)
                {
                    notUsedTheLongest = j;
                    index = i;
                }
                
                break;
            }
        }
        
        if (elemFound === false)
        {
            index = i;
            return index;
        }
    }
    
    return index;
}

function optimal(data, bs){ 
    var buffer = { 
                    data:[], // buffer data
                    pageFaultIdx: -1    // index where was page fault
                                        // -1 for page hit
                 }; 
    var pageFaults = 0;
    var pageHits = 0;

    var history = []; // page replacement history
    var age = 0; // page place time
    var idx; // Index for element of interest

        
    if (individualAlgorithms) {
        createNewCollection('Optimal');
    }
    renderBufferInit(bs);
    for (var i = 0; i < data.length; i++){
        // Render buffer after first cycle
        if (i>0){
            renderBuffer(data[i-1],buffer,bs); 
        }

        // If page is in buffer/history: page hit
        idx = findPage(data[i], history);
        if(idx != -1){
            updateBuffer(buffer,history,-1);
            pageHits++;
            continue;
        }

        // If buffer not full: add new page
        if(buffer.data.length<bs){
            history.push({page:data[i],age: age});
            updateBuffer(buffer,history,history.length-1);
            pageFaults++;
            age++;
            continue;
        }
        
        // If page is not in buffer: page fault
        idx = findOptimalPageToReplace(data.slice(i,data.length),history);
        // If element was not found
        if(idx == -1){
            return null; // Error state
        }
        history[idx].page = data[i];
        history[idx].age = age;
        pageFaults++;
        age++;
        updateBuffer(buffer,history,idx);
    }
    renderBuffer(data[data.length-1],buffer,bs);
    if (individualAlgorithms) {
        formatTables();
    }
    return {pageFaults:pageFaults,pageHits:pageHits};
}


