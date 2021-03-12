/* eslint-disable */
// import { ipcRenderer } from 'electron'

function getCerts() {


    const ca = require('win-ca')
    // const withOut = require('without')
    const path = require("path");
    const forge = require('node-forge')
    const moment = require('moment')
     const { BrowserWindow } = require('electron')
    
    // feduid = 'hi feds' //call first time, doesn't show right away, call 2nd time to grab it? hmm
    let feduid
    // ipcRenderer.send('got-cert', `{$feduid}`)

    fetch()
        .then(passList)
        .then(passId)
        // .then(function(result))
    
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
        scrapeCerts(list, d)
        console.log ('passlist hey?', feduid) //this works yay
        BrowserWindow.getFocusedWindow().webContents.send('got-cert', feduid); //send to current electron window
        return feduid
    }

    function passId(id){
        console.log('id check?', id)
        return id
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
            
            if (filterStrSub && filterStrIss && filterbigNums && !filterValidData) {
                console.log(subject)
    
                console.log('regex match for large #s: ', filterbigNums) //regex .match returns array, get 1st val in arr
                    // console.log(issuer)
                feduid = filterbigNums[0] //regex .match returns array, get 1st val in arr
                console.log('feduid: ', feduid)
                return feduid
            }
        }
    }
        return feduid
    }
    
    module.exports = getCerts;