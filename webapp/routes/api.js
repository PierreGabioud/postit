exports.register = function(server, options, next) {


    var words = 'that is a wonderful idea I look forward to seeing you in hell you dumbass bullhock even summer is too much hell for you to see you bitch I like it you love it even though you go to the club';
    var people = ['Pierre', 'Marco', 'BenJ'];
    words = words.split(' ');


    function getRandomSentence(){
        function getRandomWord() {
            return words[Math.floor(Math.random()*(words.length-1))];
        }

        var string = "";
        for(var i=0; i<Math.random()*12; i++) {
            string += getRandomWord()+' ';
        }

        return string;

    }

    function getRandomPerson() {
        return people[Math.floor(Math.random()*people.length)];
    }


    server.route({
        method:"GET",
        path:"/api/blockContent",
        handler: function(request, reply) {

            var data = {
                sentence : getRandomSentence(),
                start: (new Date()).getTime() - 1000 * 5,
                end: (new Date()).getTime()
            };

            reply(data);
        },
    });


    server.route({
        method:"GET",
        path:"/api/blockPeople",
        handler: function(request, reply) {

            console.log(getRandomPerson());

            var data = {
                person : getRandomPerson(),
                start: (new Date()).getTime() - 1000 * 5,
                end: (new Date()).getTime()
            };

            reply(data);
        },
    });


    return next();
};

exports.register.attributes = {
    name: "route-api"
};