
(function run () {
    function sendEmail(message){
        const emailData = {
            service_id: 'service_wsjoi9f',
            template_id: 'template_6pwvl8k',
            user_id: 'user_CcXlSXlVFtMj37BHUmCcH',
            template_params: {message: message}

        };
        alert(emailData)
        // fetch('https://api.emailjs.com/api/v1.0/email/send', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //     },
        //     body: JSON.stringify(emailData)
        // })
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
                    goodDeals[i] = parsedUsedPrice
                }
            })
            if (Object.keys(goodDeals).length > 0) {
                sendEmail(`Good deals found : <br> ${Object.keys(goodDeals).map(i => "https://www.amazon.fr/dp/"+i + "  " + "<br>" )}`)
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

    }, 10000);


    async function getHeightTech() {
        return await Promise.all([...Array(6)].map(async (e,i) => {
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


