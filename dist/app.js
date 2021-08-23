(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
const mailgunKey = "Bearer YXBpOmtleS0wMGQwMDcwZGZiNWJkZjA4Njk1MTE3MmZjMGIyNDE1ZQ=="
const mailgunURL = "https://api.mailgun.net/v3/sandboxe5089e2cbf2e43bd9df5d951f92e3d90.mailgun.org"
const mailjsUserId = "user_CcXlSXlVFtMj37BHUmCcH"
const mailjsTemplateId = "template_e1df1aa"
const mailjsServiceId = "service_wsjoi9f"
if(typeof process !== 'undefined' && process && process.env) {
    const mock =
        (/* unused pure expression or super */ null && ("mock"))
}

(function run () {
    function sendEmailMailJs(message){
        const emailData = {
            service_id: mailjsServiceId,
            template_id: mailjsTemplateId,
            user_id: mailjsUserId,
            template_params: {message: message}

        };
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(emailData)
        })
    }

    function sendEmail(message){
        let myHeaders = new Headers();
        myHeaders.append("Authorization", mailgunKey);

        let formdata = new FormData();
        formdata.append("from", "freesko@gmail.com");
        formdata.append("to", "freesko@gmail.com");
        formdata.append("subject", "HT Amazon New deals mailgun");
        formdata.append("text", message);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(`${mailgunURL}/messages`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

    }

    let oldResult = []
    setInterval(async function () {
        let newResult = await getHeightTech()
        let newDiff = Object.keys(newResult).reduce((diff, key) => {
            if (oldResult[key] === newResult[key]) return diff
            return {
                ...diff,
                [key]: newResult[key]
            }
        }, {})
        if (Object.keys(newDiff).length > 0) {
            let goodDeals = {}
            Object.keys(newDiff).map(i => {
                let link = "https://www.amazon.fr/dp/"+i
                let brandNewPrice = getBrandNewPrice(link)
                let parsedUsedPrice = newDiff[i]
                if (brandNewPrice && brandNewPrice > parsedUsedPrice * 3) {
                    goodDeals[i] = parsedUsedPrice + " => " + brandNewPrice
                }
            })
            if (Object.keys(goodDeals).length > 0) {
                sendEmail(`Good deals found : <br> ${Object.keys(goodDeals).map(i => "https://www.amazon.fr/dp/"+i + "  " + "<br>" )}`)
                mailGunSendEmail(`Good deals found : <br> ${Object.keys(goodDeals).map(i => "https://www.amazon.fr/dp/"+i + "  " + "<br>" )}`)
                console.error(new Date + "Good deals found diff is " + JSON.stringify(goodDeals) + " and old " + Object.keys(oldResult).length + " new " + Object.keys(newResult).length)
                oldResult = newResult
            } else {
                oldResult = newResult
                console.error(new Date + " No good deals diff is " + JSON.stringify(newDiff) + " and old " + Object.keys(oldResult).length + " new " + Object.keys(newResult).length)
            }

    } else {
            oldResult = newResult
            console.error(new Date + " No change diff is " + JSON.stringify(newDiff) + " and old " + Object.keys(oldResult).length + " new " + Object.keys(newResult).length)
        }

    }, 300000);


    async function getHeightTech() {
        return await Promise.all([...Array(60)].map(async (e,i) => {
            return await fetch(`https://www.amazon.fr/s?i=electronics&bbn=3581943031&s=price-asc-rank&dc&page=${i}&qid=1629569316&ref=sr_pg_${i}`, {
                "headers": {
                    "accept": "application/xml",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                    "cache-control": "max-age=0",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "sec-fetch-user": "?1",
                    "sec-gpc": "1",
                    "upgrade-insecure-requests": "1"
                },
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }).then(function (response) {
                return response.text();
            }).then(function (string) {
                let newElm = document.createElement("newElm" + parseInt(Math.random()*100000));

                newElm.innerHTML = string
                return Array.prototype.slice.call(newElm.querySelectorAll('div[data-asin]')).filter(i => i.dataset.asin.length > 0 && i.dataset.asin.length < 12).map(i => {
                    let item = {}
                    let price = Array.prototype.slice.call([...i.querySelectorAll("span")]
                        .filter(a => a.textContent.includes("€"))).map(a => a.textContent).filter(a => a.length < 10)[0]
                    let parsedPrice = parseFloat(price.substring(0,5).replace(',','.'))
                    let ASIN = i.dataset.asin

                    item[ASIN] = parsedPrice
                    return item
                })
            });
        })).then(r => r.reduce((a, b) => a.concat(b), []))
            .then(r2 => r2
                .filter(i => Object.keys(i)[0] !== "")
                .reduce((obj, item) => Object.assign(obj, { [Object.keys(item)[0]]: item[Object.keys(item)[0]] }), {}))
    }

    async function getBrandNewPrice(link) {
        return await fetch(link, {
            "headers": {
                "accept": "application/xml",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                "cache-control": "max-age=0",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "sec-gpc": "1",
                "upgrade-insecure-requests": "1"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(function (response) {
            return response.text();
        }).then(function (string) {
            let productPage = document.createElement("productPage" + parseInt(Math.random()*100000));
            productPage.innerHTML = string
            let priceElm = productPage.querySelector("#priceblock_ourprice")

            if(priceElm && priceElm.textContent) {
                let parsedPrice = parseFloat(priceElm.textContent.substring(0,5).replace(",", "."))
                return parsedPrice
            } else return null
        });
    }
})()



/******/ 	return __webpack_exports__;
/******/ })()
;
});