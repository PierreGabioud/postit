var profiles = [
    '3405951d-6cbf-470f-8a02-65bdcbd9ba80', // marco
    '9b30616a-8bd6-4334-8626-a1e909b3ffe9', // pierre
    '2bc52c64-0b9e-46bd-b397-60f5ee0ec580' // benji
]


exports.treatBlock = (expid, timeid, outFinal) => {
    require('../speaker.js').identify(profiles, outFinal).then( (status) => {

        var profile = mapProfiles(status.processingResult.identifiedProfileId);

        console.log(profile); //'00000000-0000-0000-0000-000000000000'

        require('../database.js').storeBlockOwner(expid, timeid, profile );


    });
    require('../speechToText.js').speech2text(outFinal).then((body) => {
        console.log(body);
        var text = JSON.parse(body).results[0].lexical
        console.log(text);

        require('../database.js').storeBlockText(expid, timeid, text );


    });


}

function mapProfiles (guid) {
    var profileMap =  {
        '3405951d-6cbf-470f-8a02-65bdcbd9ba80': 'marco',
        '9b30616a-8bd6-4334-8626-a1e909b3ffe9': 'pierre',
        '2bc52c64-0b9e-46bd-b397-60f5ee0ec580': 'benji'
    };
    if (profileMap[guid]) return profileMap[guid];
    else return '';

}
