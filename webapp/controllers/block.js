var profiles = [
    '3405951d-6cbf-470f-8a02-65bdcbd9ba80', // marco
    '9b30616a-8bd6-4334-8626-a1e909b3ffe9', // pierre
    '2bc52c64-0b9e-46bd-b397-60f5ee0ec580' // benji
]

exports.treatBlock = (outFinal) => {
    require('../speaker.js').identify(profiles, outFinal);
}
