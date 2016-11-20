var profiles = [
    '9fab49a0-929e-48fa-8f79-b815b36ace74', // marco
    'af3c680c-22c7-4ecd-8b52-a7291652d6bf', // pierre
    'a2331af8-b01f-4e70-9f99-d71cf519a554' // benji
]


exports.treatBlock = (expid, timeid, outFinal) => {
    require('../speaker.js').identify(profiles, outFinal).then( (status) => {

        var profile = mapProfiles(status.processingResult.identifiedProfileId);

        console.log(profile); //'00000000-0000-0000-0000-000000000000'

        require('../database.js').storeBlockOwner(expid, timeid, profile );


    });
    require('../speechToText.js').speech2text(outFinal).then((body) => {
        console.log(body);
        var text = JSON.parse(body).results ? JSON.parse(body).results[0].lexical : '';
        console.log(text);

        require('../database.js').storeBlockText(expid, timeid, text );


    });


}

function mapProfiles (guid) {
    var profileMap =  {
        '9fab49a0-929e-48fa-8f79-b815b36ace74': 'marco',
        'af3c680c-22c7-4ecd-8b52-a7291652d6bf': 'pierre',
        'a2331af8-b01f-4e70-9f99-d71cf519a554': 'ben'
    };
    if (profileMap[guid]) return profileMap[guid];
    else return 'unknown';

}
