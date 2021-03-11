/* eslint-disable */

function getCerts() {


    const ca = require('win-ca')
    // const withOut = require('without')
    const path = require("path");
    const forge = require('node-forge')
    const moment = require('moment')
    
    fetch()
        .then(passList)
    
    function fetch() {
        var list = []
        return new Promise(resolve => {
                ca({
                    store: 'My',
                    async: true,
    
                    format: ca.der2.pem,
                    ondata: list,
                    onend: resolve
                })
            })
            .then(_ => list)
    }
    
    
    function passList(list) {
        var d = Date.now();
    
        let timer = setInterval(_ => {
            clearInterval(timer)
        }, 1000)
        return scrapeCerts(list, d)
    }
    
    
    
    
    
    function scrapeCerts(roots, date) {
        for (let pem of roots) {
            cert = forge.pki.certificateFromPem(pem)
    
    
            validity = cert.validity.notAfter
    
            // console.log({ date })
            const now_date = moment(date) //.format("YYYY-MM-DD"); human
            // console.log({ now_date })
            const validity_date = moment(validity) //.format("YYYY-MM-DD")
            // console.log({ validity_date })
    
    
            issuer = cert.issuer.attributes
                .map(attr => ['', attr.value].join(': '))
                .join(', ');
    
            subject = cert.subject.attributes
                .map(attr => ['', attr.value].join('='))
                .join(', ');
    
    
            filterValidData = now_date >= validity_date
    
            // console.log(filterValidData)
            console.log('wow here already')
    
            filterStrSub = subject.includes("affiliate")
            filterStrIss = issuer.includes("Veterans")
            regex = /\d{10,}/g; //look for 10 or more consecutive digits --> source: https://riptutorial.com/regex/example/5023/matching-various-numbers
            filterbigNums = subject.match(regex)
            feduid = ''
            if (filterStrSub && filterStrIss && filterbigNums && !filterValidData) {
                console.log(subject)
    
                console.log('regex match for large #s: ', filterbigNums) //regex .match returns array, get 1st val in arr
                    // console.log(issuer)
                feduid = filterbigNums[0] //regex .match returns array, get 1st val in arr
                console.log('feduid: ', feduid)
            }
        }
    }
    }
    
    module.exports = getCerts;