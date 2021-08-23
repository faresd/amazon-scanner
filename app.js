const dotenv = require('dotenv')
const mailgunKey = process.env.MAILGUN_KEY
const mailgunURL = process.env.MAILGUN_URL
const mailjsUserId = process.env.MAILJS_USER_ID
const mailjsTemplateId = process.env.MAILJS_TEMPLATE_ID
const mailjsServiceId = process.env.MAILJS_SERVICE_ID

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

    let fares = document.createElement("fares");
    let oldResult = []
    setInterval(async function () {
        let newResult = await getHeightTech()
        if (oldResult.length === 0) {
            oldResult = newResult
            return
        }

        let diff = newResult.filter(x => !oldResult.includes(x));

        if (diff.length > 0) {
            sendEmail(`New items added : <br> \n ${diff.map(i => "https://www.amazon.fr/dp/"+i + "  " + " \n <br>" )}`)
            console.error(new Date + "New items found diff is " + diff + " and old " + oldResult.length + " new " + newResult.length)
            oldResult = newResult
        } else console.error(new Date + " no change diff is " + diff + " and old " + oldResult.length + " new " + newResult.length)

    }, 600000);


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
                fares.innerHTML = string
                return Array.prototype.slice.call(fares.querySelectorAll('div[data-asin]')).map(i => i.dataset.asin)
            });
        })).then(r => r.reduce((a, b) => a.concat(b), [])).then(r2 => r2.filter(i => i !== ""))
    }
})()


