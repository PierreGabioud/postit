$(document).ready(function(){


    var timelineContainer = $('#timelineContainer');


    function getNiceDate(date) {
        var date = new Date(date);
        return date.getHours()+'h'+date.getMinutes();
    }


    function addToTimeline(blockText) {
        timelineContainer.append($('<div>', {
            html: blockText.sentence+" "+getNiceDate(blockText.start),
        }));
    }


    var startSessionTime = (new Date()).getTime();

    var interval = setInterval(function(){

        console.log(startSessionTime);
        var getBlockTexts = $.ajax({
            url: '/api/blockContent',
            data: {
                from: startSessionTime
            },
            method:'GET'
        });


        var getBlockPeople = $.ajax({
            url: '/api/blockPeople',
            method: 'GET'
        });


        $.when(getBlockTexts, getBlockPeople).then(function(blockTexts, blockPeople){
            console.log(blockTexts[0]);
            console.log(blockPeople[0]);

            addToTimeline(blockTexts[0]);
        });


        startSessionTime = (new Date()).getTime();


    }, 3000);


});