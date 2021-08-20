
(function run () {

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@2/dist/email.min.js';
    document.head.appendChild(script);
    emailjs.init("user_CcXlSXlVFtMj37BHUmCcH");
    let fares = document.createElement("fares");
    let oldResult = []
    setInterval(async function () {
        let newResult = await getHeightTech()
        let diff = newResult.filter(x => !oldResult.includes(x));
        if (diff.length > 0) {
            alert(diff)
            oldResult = newResult
        } else console.error(new Date + " no change diff is " + diff + " and old " + oldResult.length + " new " + newResult.length)

    }, 200000);


    async function getHeightTech() {
        return await Promise.all([1, 2, 3, 4, 5, 6].map(async i => {
            return await fetch(`https://www.amazon.fr/s?i=electronics&bbn=3581943031&s=price-asc-rank&dc&qid=1629479347&ref=sr_pg_${i}`, {
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


var data = {
    service_id: 'service_wsjoi9f',
    template_id: 'template_0egpq26',
    user_id: 'user_CcXlSXlVFtMj37BHUmCcH',

};

fetch('https://api.emailjs.com/api/v1.0/email/send', {
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json'
}).then(function() {
    alert('Your mail is sent!');
}).catch(function(error) {
    alert('Oops... ' + JSON.stringify(error));
});
// code fragment



fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify(data)
})


var data = {
    service_id: 'service_wsjoi9f',
    template_id: 'template_e1df1aa',
    user_id: 'user_CcXlSXlVFtMj37BHUmCcH',

};