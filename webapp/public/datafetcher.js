var PEOPLE = {
    'marco': 0,
    'pierre': 1,
    'ben': 2
};


var fetchedBlockNb = 0,
    fakeFetchedBlockNb = 0,
    experimentID = parseInt(Math.random()*10000000),
    INTERVAL_TIME = 3000,
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


    var previousOwner = null;
    var currentText = '';

    function addToTimeline(text, owner) {
        console.log(owner.owner +" : "+ text);

        if(!previousOwner) previousOwner = owner;


        if(previousOwner.owner == owner.owner){

            currentText += text;
        }
        else{
            if(currentText.length > 0){
                timelineContainer.append($('<div>', {
                    html: previousOwner.owner +" : "+currentText,
                }));
            }
            previousOwner = owner;
            currentText = text;

        };


    }


    function addToStats(blocksPeople, blockNb) {
        var i=0;
        blocksPeople.forEach(function(el) {
            sharedTime.data.datasets[0].data[PEOPLE[el.owner]] += 5;
            sharedTime.update();


            dataTable.addRows([
                [el.owner, blockNb+i, blockNb+i+1]
            ]);
            i++;

            chart.draw(dataTable);

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
    }, INTERVAL_TIME /3 );

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

        var currentSpeaker = null;
        var nextText = '';

        $.when(getBlockTexts, getBlockPeople).then(function(blocksText, blocksPeople){
            console.log(blocksText[0]);
            console.log(blocksPeople[0]);

            console.log(blocksText[0][0]);
            console.log(blocksPeople[0][0]);

            if(!currentSpeaker) currentSpeaker = blocksPeople[0][0];

            var i = 0
            while( i < blocksText[0].length ){
                while(currentSpeaker == blocksPeople[0][i]  &&  i < blocksText[0].length ){
                    nextText += blocksText[0][i].text;
                    i++;
                }

                //create new bubble
                addToTimeline(nextText, blocksPeople[0][i-1]);


                currentSpeaker = blocksPeople[0][i];
                nextText = blocksText[0][i].text;
                i++;

            }


            //addToTimeline(blocksText[0]);
            addToStats(blocksPeople[0], fetchedBlockNb);
            checkForKeywords(blocksText[0]);
            fetchedBlockNb+=blocksText[0].length;
        });

        startSessionTime = (new Date()).getTime();

    }, INTERVAL_TIME);


    google.charts.load('current', {'packages':['timeline']});
    google.charts.setOnLoadCallback(drawChart);
    var dataTable,
        chart,
        container;

    function drawChart() {
        container = document.getElementById('timeline');
        chart = new google.visualization.Timeline(container);
        dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: 'string', id: 'President' });
        dataTable.addColumn({ type: 'number', id: 'Start' });
        dataTable.addColumn({ type: 'number', id: 'End' });
        dataTable.addRows([
            //[ 'marco',      new Date(1797, 2, 4),  new Date(1801, 2, 4) ],
            //[ 'ben',  new Date(1801, 2, 4),  new Date(1809, 2, 4) ]
            ]);

        chart.draw(dataTable);

        /*
        setTimeout(function(){
            dataTable.addRows([
                ['Washington', new Date(1840, 4, 30), new Date(1850, 5, 4)]
            ]);

            chart.draw(dataTable);
        },2000);
        */
    }


});