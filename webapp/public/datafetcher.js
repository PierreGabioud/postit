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
    keywordsAlarms = [],
    imgs;

$(document).ready(function(){

    imgs = {
        'ben': $('<img>', {src: '/public/users/ben.png'}),
        'marco': $('<img>', {src: '/public/users/marco.png'}),
        'pierre': $('<img>', {src: '/public/users/pierre.png'})
    };


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
                "rgba(120,240,120,0.5)",
                "rgba(120,120,240,0.5)",
                "rgba(240,120,120,0.5)"
            ],
            label: 'My dataset' // for legend
        }],
        labels: [
            "Marco",
            "Pierre",
            "BenJ",
        ]
    };

    var ctxSharedTime = document.getElementById('donut-global').getContext('2d');

    var sharedTime = new Chart(ctxSharedTime,{
        type: 'doughnut',
        data: dataShareTime,
    });

    var currentOwner,
        lastDiv;

    function addToTimeline(ownerArray, textArray) {

        for(var i=0; i<textArray.length; i++) {
            console.log(ownerArray[i].owner, currentOwner);
            if(ownerArray[i].owner != currentOwner) {
                lastDiv = $('<div>', {
                    class: 'chip chip-'+PEOPLE[ownerArray[i].owner]
                });
                var img = $('<img>', {
                    src: '/public/users/'+ownerArray[i].owner+'.png',
                    class: 'icon'
                });


                var content = ownerArray[i].owner +" : "+textArray[i].text;

                lastDiv.append(img).append(content).appendTo(timelineContainer);

                currentOwner = ownerArray[i].owner;
                console.log('NOT SAME OWNER '+lastDiv);

            } else {
                console.log('SAME OWNER '+lastDiv);
                lastDiv.append( " " +textArray[i].text);
            }

        }

        console.log('LENGTH = '+lastDiv.text().length);
        if(lastDiv.text().length > 80) {
            lastDiv.css({'height':'45px', 'line-height': '20px'});
        }


        var scrollHeight = timelineContainer[0].scrollHeight;
        if(scrollHeight > timelineContainer.height() + 100) {
            timelineContainer.animate({
                scrollTop: scrollHeight
            }, 2000);
        }

    }


    var firstRender = false;
    function addToStats(blocksPeople, blockNb) {
        var i=0;
        blocksPeople.forEach(function(el) {
            sharedTime.data.datasets[0].data[PEOPLE[el.owner]] += 5;
            sharedTime.update();


            dataTable.addRows([
                [el.owner, blockNb+i, blockNb+i+1]
            ]);
            i++;



            chart.draw(dataTable, options);

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

    function addTextThatMatchedKeywordTakeNote(text) {
        var index = (text.indexOf('note') + 4);
        var note = text.substring(index);
        if(note.length > 2) {
            $('#post-its').append($('<div>', {
                class: 'post-it',
                html: note
            }));
        }

    }

    function launchVisualAlarm() {
        $("body").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    }

    function checkForKeywords(textBlocks) {
        var newText = "";
        textBlocks.forEach((el) => {
            newText += el.text;
        });
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


    function checkForTakeNoteKeyword(textBlocks) {
        var newText = "";
        textBlocks.forEach((el) => {
            newText += el.text;
        });

        if(newText.indexOf('takenote') != -1 || newText.indexOf('take note') != -1 || newText.indexOf('take a note') != -1) {
            addTextThatMatchedKeywordTakeNote(newText);
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
    }, INTERVAL_TIME );

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

            addToTimeline(blocksPeople[0], blocksText[0]);
            addToStats(blocksPeople[0], fetchedBlockNb);
            checkForKeywords(blocksText[0]);
            checkForTakeNoteKeyword(blocksText[0]);
            fetchedBlockNb+=blocksText[0].length;
        });

        startSessionTime = (new Date()).getTime();

    }, INTERVAL_TIME);


    google.charts.load('current', {'packages':['timeline']});
    google.charts.setOnLoadCallback(drawChart);
    var dataTable,
        chart,
        container,
        options = {
            colors: ['rgb(209,240,193)', 'rgb(187,192,242)', 'rgb(233,194,191)'],
        };


    function drawChart() {
        container = document.getElementById('timeline');
        chart = new google.visualization.Timeline(container);
        dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: 'string', id: 'President' });
        dataTable.addColumn({ type: 'number', id: 'Start' });
        dataTable.addColumn({ type: 'number', id: 'End' });
        dataTable.addRows([
            [ 'marco', -0.1,  0 ],
            [ 'pierre', -0.1,  0 ],
            [ 'ben', -0.1,  0 ],
        ]);

        window.dataTable = dataTable;

        console.log(dataTable);

        chart.draw(dataTable, options);
    }


    $('#stop').on('click', function(){
        clearInterval(interval);
        clearInterval(intervalFakeCreation);
    });
});