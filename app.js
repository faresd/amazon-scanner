const mailgunKey = process.env.MAILGUN_KEY
const mailgunURL = process.env.MAILGUN_URL
const mailjsUserId = process.env.MAILJS_USER_ID
const mailjsTemplateId = process.env.MAILJS_TEMPLATE_ID
const mailjsServiceId = process.env.MAILJS_SERVICE_ID
if(typeof process !== 'undefined' && process && process.env) {
    const mock =
        process.env.MOCK
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

    function sendEmail(subject, message){
        let myHeaders = new Headers();
        myHeaders.append("Authorization", mailgunKey);

        let formdata = new FormData();
        formdata.append("from", "freesko@gmail.com");
        formdata.append("to", "freesko@gmail.com");
        formdata.append("subject", subject);
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

        if (isNight()) return

        let newResult = await getHeightTech()
        if(oldResult.length === 0 ) {
            oldResult = newResult
            return
        }

        let newDiff = Object.keys(newResult).reduce((diff, key) => {
            if (oldResult[key] === newResult[key]) return diff
            return {
                ...diff,
                [key]: newResult[key]
            }
        }, {})
        if (Object.keys(newDiff).length > 0) {
            let goodDeals = {}
            await Promise.all(Object.keys(newDiff).map(async i => {
                let link = "https://www.amazon.fr/dp/"+i
                let brandNewPrice = await getBrandNewPrice(link)
                let parsedUsedPrice = newDiff[i]


                console.error(new Date + "New items found, diff is " + newDiff + " and old " + oldResult.length + " new " + newResult.length)
                console.error("brandNewPrice is " + brandNewPrice + " and " + "parsedUsedPrice" + parsedUsedPrice + " and 3x price used is " + parsedUsedPrice * 3 + "and link is : " + link)
                if (brandNewPrice && brandNewPrice > parsedUsedPrice * 3) {
                    goodDeals[i] = parsedUsedPrice + " => " + brandNewPrice
                }
                newDiff[i] = newDiff[i] + " => " + brandNewPrice
            }))
            sendEmail("HT Amazon New items added mailgun", `New items added :  \n ${Object.keys(newDiff).map(i => "https://www.amazon.fr/dp/"+i + "  " + " With pricing : " + newDiff[i] + " \n" )}`)

            if (Object.keys(goodDeals).length > 0) {
                sendEmail("HT Amazon New deals mailgun",`Maybe good deals found : \n ${Object.keys(goodDeals).map(i => "https://www.amazon.fr/dp/" + i + "  " + " With pricing : " + goodDeals[i] + " \n")}`)
                console.error(new Date + " Good deals found diff is " + JSON.stringify(goodDeals) + " and old " + Object.keys(oldResult).length + " new " + Object.keys(newResult).length)
                oldResult = newResult
            } else {
                oldResult = newResult
                console.error(new Date + " No good deals diff is " + JSON.stringify(newDiff) + " and old " + Object.keys(oldResult).length + " new " + Object.keys(newResult).length)
            }

        } else {
            oldResult = newResult
            console.error(new Date + " No change diff is " + JSON.stringify(newDiff) + " and old " + Object.keys(oldResult).length + " new " + Object.keys(newResult).length)
        }

    }, 60000*30);


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
                let items = []
                Array.prototype.slice.call(newElm.querySelectorAll('div[data-asin]')).filter(i => i.dataset.asin.length > 0 && i.dataset.asin.length < 12).map(i => {

                    let item = {}
                    let ASIN = i.dataset.asin
                    let price = Array.prototype.slice.call([...i.querySelectorAll("span")]
                        .filter(a => a.textContent.includes("€"))).map(a => a.textContent).filter(a => a.length < 10)[0]
                    if(ASIN && price) {
                        let parsedPrice = parseFloat(price.substring(0,5).replace(',','.'))
                        item[ASIN] = parsedPrice
                        items.push(item)
                    }
                })
                return items
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
            let bPriceElm = productPage.querySelector("#priceblock_businessprice")
            let normalPriceElm = productPage.querySelector("#priceblock_ourprice")
            let priceElm = normalPriceElm? normalPriceElm : bPriceElm

            if(priceElm && priceElm.textContent) {
                let parsedPrice = parseFloat(priceElm.textContent.substring(0,5).replace(",", "."))
                return parsedPrice
            } else return null
        });
    }

    function isNight() {
        let startTime = '1:00:00';
        let endTime = '7:00:00';

        let currentDate = new Date()

        let startDate = new Date(currentDate.getTime());
        startDate.setHours(parseInt(startTime.split(":")[0]))
        startDate.setMinutes(parseInt(startTime.split(":")[1]))
        startDate.setSeconds(parseInt(startTime.split(":")[2]))

        let endDate = new Date(currentDate.getTime());
        endDate.setHours(parseInt(endTime.split(":")[0]))
        endDate.setMinutes(parseInt(endTime.split(":")[1]))
        endDate.setSeconds(parseInt(endTime.split(":")[2]))

        return startDate < currentDate && endDate > currentDate
    }
})()


