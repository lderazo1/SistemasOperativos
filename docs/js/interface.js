$(document).ready(function(){
    // Bind Author button
    $('#authors-button').click(function(){
        toggleAuthorsFrame();
    });
    
    // Draw chart
    faultChart.render();
});

// Chart column colors
var colorList = ['#d43515', '#d47415', '#d49b2a', '#d4d420', '#94d415', '#2ad447', '#20d498', '#20d4d4', '#20b6d4', '#1594d4', '#1574d4', '#203ed4'];

// Define axis data
var chartData = [
                    {label: "FIFO", y:0,color:colorList[0]},
                    {label: "Aging",y:0,color:colorList[1]},
                    {label: "Second chance",y:0,color:colorList[2]},
                    {label: "Clock",y:0,color:colorList[3]},
                    {label: "LRU",y:0,color:colorList[7]},
                    {label: "MRU",y:0,color:colorList[8]},
                    {label: "NFU",y:0,color:colorList[9]},
                    {label: "Random",y:0,color:colorList[10]},
                    {label: "Optimal",y:0,color:colorList[11]},
                    {label: "GClock",y:0,color:colorList[12]}
                    ];

// Define chart object
var faultChart = new CanvasJS.Chart("chart-container",{
    animationEnabled: true,
    title:{
        text: "Fallos Página"
    },
    axisY: {
        title: "Fallos por página"
    },
    data:[
        {
            type:"column",
            toolTipContent: "{label}: {y} page faults",
            dataPoints: chartData
        }

    ]
});

function toggleAuthorsFrame(){
    $('.authors-wrap').toggleClass('opened');
}

function setProgressBar(percent){
    $('#bar').css('width',percent+'%');
}

// Error notification for invalid page data format
function spawnPageValidationError(){
    $('#invalid-page-data-error').show();
//    hideTimer = setTimeout(function(){
//        $('#invalid-page-data-error').hide();
//    },5000);
}

function despawnPageValidationError(){
    $('#invalid-page-data-error').hide();
}
