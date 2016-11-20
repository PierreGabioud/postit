var PEOPLE = {
    'marco': 0,
    'pierre': 1,
    'ben': 2
};


var fetchedBlockNb = 0,
    fakeFetchedBlockNb = 0,
    experimentID = parseInt(Math.random()*10000000),
    INTERVAL_TIME = 1500,
    keywords = [],
    keywordsAlarms = [];

$(document).ready(function(){


    var timelineContainer = $('#timelineContainer'),
        keywordMatches = $('#keyword-matches'),
        keywordMatchesAlarm = $('#keyword-matches-alarm'),
        enableAlarms = false;


    $('#keywords').on('input', function(){
        keywords = $(this).val().replace(/\s\s+/g, ' ').split(' ').filter(function(el){ return el.length > 2 });
        console.log(keywords.length);
    });

    $('#keywords-alarm').on('input', function(){
        keywordsAlarms = $(this).val().replace(/\s\s+/g, ' ').split(' ').filter(function(el){ return el.length > 2 });
        console.log(keywordsAlarms.length);
    });

    $('#enable-alarms').on('change', function(){
       enableAlarms = $(this).is(':checked');
    });


    var dataShareTime = {
        datasets: [{
            data: [
                0,
                0,
                0
            ],
            backgroundColor: [
                "rgba(120,120,240,0.5)",
                "rgba(120,240,120,0.5)",
                "rgba(240,120,120,0.5)"
            ],
            label: 'My dataset' // for legend
        }],
        labels: [
            "Pierre",
            "Marco",
            "BenJ",
        ]
    };

    var ctxSharedTime = document.getElementById('donut-global').getContext('2d');

    var sharedTime = new Chart(ctxSharedTime,{
        type: 'doughnut',
        data: dataShareTime,
    });


    var dataTimelines = {
        labels: [],
        datasets: [
            {
                label: "Marco",
                fill: true,
                lineTension: 0.1,
                backgroundColor: "rgba(192,75,192,0.4)",
                borderColor: "rgba(192,75,192,1)",
                data: [],
                spanGaps: false,
            },
            {
                label: "Pierre",
                fill: true,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                data: [],
                spanGaps: true,
            },
            {
                label: "Ben",
                fill: true,
                lineTension: 0.1,
                backgroundColor: "rgba(192,192,75, 0.4)",
                borderColor: "rgba(192,192,75,1)",
                data: [],
                spanGaps: false,
            }
        ]
    };

    var ctxTimeline = document.getElementById('timeline-chart').getContext('2d');
    var timelineChart = new Chart(ctxTimeline, {
        type: 'bar',
        data: dataTimelines,
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    stacked: true,
                    //barPercentage: 1
                }]
            },
            animation: {
                duration: 0
            }
        }
    });


    function getNiceTime(timeid) {
       return timeid * INTERVAL_TIME/1000;
    }


    function addToTimeline(blocksText) {
        blocksText.forEach(function(el){
            timelineContainer.append($('<div>', {
                html: el.text+" "+getNiceTime(el.timeid),
            }));


        });

    }

    function addToStats(blocksPeople, blockNb) {
        blocksPeople.forEach(function(el) {
            sharedTime.data.datasets[0].data[PEOPLE[el.owner]] += 5;
            sharedTime.update();

            console.log(timelineChart.data.labels);
            timelineChart.data.labels.push(blockNb);
            timelineChart.data.datasets[PEOPLE[el.owner]].data.push(5);
            timelineChart.data.datasets[(PEOPLE[el.owner]+1)%3].data.push(0);
            timelineChart.data.datasets[(PEOPLE[el.owner]+2)%3].data.push(0);

            if(blockNb > 6) {
                timelineChart.data.labels = timelineChart.data.labels.slice(1);
                timelineChart.data.datasets[PEOPLE[el.owner]].data = timelineChart.data.datasets[PEOPLE[el.owner]].data.slice(1);
                timelineChart.data.datasets[(PEOPLE[el.owner]+1)%3].data = timelineChart.data.datasets[(PEOPLE[el.owner]+1)%3].data.slice(1);
                timelineChart.data.datasets[(PEOPLE[el.owner]+2)%3].data = timelineChart.data.datasets[(PEOPLE[el.owner]+2)%3].data.slice(1);
            }


            timelineChart.update();

        });
    }

    function addTextThatMatchedKeyword(text) {
        keywordMatches.append($('<p>', {
            html: text
        }));
    }

    function addTextThatMatchedKeywordAlarm(text) {
        keywordMatchesAlarm.append($('<p>', {
            html: text
        }));
    }

    function launchVisualAlarm() {
        $("body").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    }

    function checkForKeywords(textBlocks) {
        var newText = "";
        textBlocks.forEach((el) => {
           newText += el.text;
        });
        console.log(newText);
        var found = false;
        keywords.forEach(function(keyword){
           if(keywords != ' ' && newText.indexOf(keyword) != -1) {
               found = true;
           }
        });
        if(found) {
            addTextThatMatchedKeyword(newText);
        }


        found = false;
        keywordsAlarms.forEach(function(keyword){
            if(keywordsAlarms != ' ' && newText.indexOf(keyword) != -1) {
                found = true;
            }
        });
        if(found) {
            addTextThatMatchedKeywordAlarm(newText);
            if(enableAlarms){
                launchVisualAlarm();
            }
        }

    }




    var startSessionTime = (new Date()).getTime();


    var intervalFakeCreation = setInterval(function(){
        console.log('POSTING FAKE DATA');
        $.ajax({
            url: '/api/createFakeBlock/' + experimentID + '/' + fakeFetchedBlockNb,
            method: 'POST',
            success: function (response) {
                console.log(startSessionTime);
                fakeFetchedBlockNb++;
            }
        });
    }, INTERVAL_TIME);

    var interval = setInterval(function(){
        console.log('GETTING FAKE DATA');

        var getBlockTexts = $.ajax({
            url: '/api/blockText/'+experimentID+'/'+fetchedBlockNb,
            method:'GET'
        });


        var getBlockPeople = $.ajax({
            url: '/api/blockOwner/'+experimentID+'/'+fetchedBlockNb,
            method: 'GET'
        });


        $.when(getBlockTexts, getBlockPeople).then(function(blocksText, blocksPeople){
            console.log(blocksText[0]);
            console.log(blocksPeople[0]);

            addToTimeline(blocksText[0]);
            addToStats(blocksPeople[0], fetchedBlockNb);
            checkForKeywords(blocksText[0]);
            fetchedBlockNb++;
        });

        startSessionTime = (new Date()).getTime();

    }, INTERVAL_TIME);


});