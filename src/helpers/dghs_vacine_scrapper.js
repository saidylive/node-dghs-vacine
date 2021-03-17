const DistrictDose = require('../models/district_dose.model');
const DistrictAefi = require('../models/district_aefi.model');
const fs = require('fs');
let axios = require("axios");
const cheerio = require('cheerio');
const rp = require('request-promise');
const { exit } = require('process');
const url = 'http://103.247.238.92/webportal/pages/covid19-vaccination.php';
const districts = {
    "1": "Dhaka",
    "2": "Faridpur",
    "3": "Gazipur",
    "4": "Gopalganj",
    "5": "Jamalpur",
    "6": "Kishoreganj",
    "7": "Madaripur",
    "8": "Manikganj",
    "9": "Munshiganj",
    "10": "Mymensingh",
    "11": "Narayanganj",
    "12": "Narsingdhi",
    "13": "Netrokona",
    "14": "Rajbari",
    "15": "Sariatpur",
    "16": "Tangail",
    "17": "Tangail",
    "18": "Bandarban",
    "19": "Brahmanbaria",
    "20": "Chandpur",
    "21": "Chittagong",
    "22": "Comilla",
    "23": "Cox`s Bazar",
    "24": "Feni",
    "25": "Khagrachari",
    "26": "Lakshmipur",
    "27": "Noakhali",
    "28": "Rangamati",
    "29": "Bogra",
    "30": "Nowabganj",
    "31": "Dinajpur",
    "32": "Gaibandha",
    "33": "Joypurhat",
    "34": "Kurigram",
    "35": "Lalmonirhat",
    "36": "Noagoan",
    "37": "Natore",
    "38": "Nilphamari",
    "39": "Pabna",
    "40": "Panchagharh",
    "41": "Rajshahi",
    "42": "Rangpur",
    "43": "Sirajganj",
    "44": "Thakurgoan",
    "45": "Bagerhat",
    "46": "Chuadanga",
    "47": "Jessore",
    "48": "Jhenaidah",
    "49": "Khulna",
    "50": "Kushtia",
    "51": "Magura",
    "52": "Meherpur",
    "53": "Narail",
    "54": "Satkhira",
    "55": "Barguna",
    "56": "Barisal",
    "57": "Bhola",
    "58": "Jhalakati",
    "59": "Patuakhali",
    "60": "Perojpur",
    "61": "Habiganj",
    "62": "Moulvi Bazar",
    "63": "Sunamganj",
    "64": "Sylhet"
}

const evaluate_javascript = (s) => {
    return eval("JSON.stringify(" + s + ")")
}

const process_html_data = (html) => {
    const $ = cheerio.load(html);
    let items = $('.callout .info-box-number');
    let out = {};
    let dose_items = [
        "1st_doses_administered_male",
        "1st_doses_administered_female",
        "1st_doses_administered_24_male",
        "1st_doses_administered_24_female",
    ]
    let sum_data_items = [
        "vaccine_target",
        "total_registration",
        "registerd_against_target",
        "1st_doses_administered",
        "1st_dose_against_registration",
        "AEFI_cases_after_first_dose",
    ]
    let index = 0;
    for (const item of items) {
        let key = dose_items[index]
        let cval = $(item).text()
        cval = cval.replace(/[,]/g, "").trim()
        try {
            out[key] = Number.parseFloat(cval)
        } catch (error) {
            out[key] = cval
        }
        index++
    }
    items = $('.info-box-sec .info-box-number');

    index = 0;
    for (const item of items) {
        let key = sum_data_items[index]
        let cval = $(item).text()
        if (cval) {
            cval = cval.trim();
        }
        cval = cval.replace(/[,%()]/g, "").trim()
        // console.log(cval)
        try {
            out[key] = Number.parseFloat(cval)
        } catch (error) {
            out[key] = cval
        }
        index++
    }
    return out
}

const process_html = (html) => {
    let text = html.replace(/[\n\r]/g, "")
    const pattern = /(Highcharts.chart\('(\w+)', {)(.*?)(}\);)/g
    let results = text.matchAll(pattern)
    let dataset = {}
    for (let item of results) {
        let chart_code = item[2]
        let body = item[3]
        let jtext = "{" + body + "}"
        jtext = evaluate_javascript(jtext)
        let param = JSON.parse(jtext)
        let data = parse_chart_data(chart_code, param)
        dataset[chart_code] = data
        // console.log(data)
        // console.log("----------------------------")
    }
    let sdata = process_html_data(html)
    dataset["summary"] = sdata

    // console.log(dataset)
    return dataset
}

const parse_chart_data = (chart_code, param) => {
    let labels = param["xAxis"]["categories"]
    let total_series = param["series"].length
    let out = {}
    if (total_series > 1) {
        let d1 = param["series"][0]["data"]
        let d2 = param["series"][1]["data"]

        let n1 = param["series"][0]["name"]
        let n2 = param["series"][1]["name"]
        for (let index = 0; index < labels.length; index++) {
            let item = {}
            let x = labels[index]
            let y1 = d1[index]
            let y2 = d2[index]

            item[n1] = y1
            item[n2] = y2

            out[x] = item
        }

    } else {
        let data = param["series"][0]["data"]
        for (let index = 0; index < labels.length; index++) {
            const element = labels[index];
            let x = labels[index]
            let y = data[index]
            out[x] = y
        }
    }
    return out
}

const get_post_page = async (district_id) => {
    const params = new URLSearchParams()
    params.append('division', '')
    params.append('district', district_id)
    params.append('period', 'LAST_1_MONTH')
    params.append('Submit', "Search")

    let options = {
        method: "POST",
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    console.log("axios check")
    return axios.post(url, params, options)
}

const scrap_single_district_page = async (district_id) => {
    const distname = districts[district_id];
    console.log("Processing: ", distname)

    let res = await get_post_page(district_id)
    let html = res.data
    console.log("Got http response")
    let data = process_html(html)
    console.log("Process done")
    return data
}

const scrap_all_district_page = async () => {
    let row = 0;
    for (const district_id in districts) {
        row++
        console.log("Row: ", row)
        const distname = districts[district_id];

        let data = scrap_single_district_page(district_id)
        let jsontext = JSON.stringify(data)
        let dist_items = process_district_page_data_json(district_id, distname, JSON.stringify(data))
        console.log("Writing to file")
        let filename = "district-" + district_id + "-" + distname + ".json"
        fs.writeFileSync("data/" + filename, jsontext)
        console.log("File write Done: ", filename)
    }
    return row
}

const insert_district_dose_item = async (rowitem) => {
    return new Promise((resolve, reject) => {
        const new_district_dose = new DistrictDose(rowitem);
        DistrictDose.createOrUpdate(new_district_dose, function (err, insertId) {
            if (err) {
                reject(err)
            } else {
                setTimeout(() => {
                    console.log({ error: false, message: "DistrictDose added successfully!", data: insertId });
                    resolve({ error: false, message: "DistrictDose added successfully!", data: insertId });
                }, 100);
            }
        });
    });
}

const insert_district_aefi_item = async (rowitem) => {
    return new Promise((resolve, reject) => {
        const new_district_aefi = new DistrictAefi(rowitem);
        DistrictAefi.createOrUpdate(new_district_aefi, function (err, insertId) {
            if (err) {
                console.log("Error Aefi Data: ", err)
                reject(err)
            } else {
                console.log({ error: false, message: "DistrictAefi added successfully!", data: insertId });
                resolve({ error: false, message: "DistrictAefi added successfully!", data: insertId });
            }
        });
    });
}

const process_district_page_data_json = async (district_id, distname, jsontext) => {
    let index = 0
    let data = JSON.parse(jsontext)
    let rowsdata = []
    let gender_data = data["doses_administered_gender"]
    let rate_data = data["doses_administered_rate"]
    let summary_data = data["summary"]

    for (const datestr in gender_data) {
        index++
        let rowitem = {}
        if (Object.hasOwnProperty.call(gender_data, datestr)) {
            const row = gender_data[datestr];
            rowitem["date"] = datestr
            rowitem["district_id"] = district_id
            rowitem["district_name"] = distname
            rowitem["male"] = row.Male
            rowitem["female"] = row.Female
            rowitem["total"] = row.Female + row.Male
            rowitem["rate"] = Object.hasOwnProperty.call(rate_data, datestr) ? rate_data[datestr] : null
            rowitem["aefi"] = summary_data["AEFI_cases_after_first_dose"]
        }
        let insert_id = await insert_district_dose_item(rowitem)
        // console.log("Index", index)
        if (insert_id) {
            rowsdata.push(rowitem)
        }
    }
    if (rowsdata.length > 0) {
        // console.log("inserting aefi: ", distname)
        await insert_district_aefi_item(rowsdata[rowsdata.length - 1])
        // console.log("inserted aefi: ", distname)
    }
    return new Promise((resolve, reject) => {
        // console.log("All Done now resolving")
        resolve(rowsdata)
    });
}

const process_all_district_page_data = async () => {
    return new Promise((resolve, reject) => {
        let row = 0;
        let rowsdata = []
        for (const district_id in districts) {
            row++
            // if (row > 1) {
            //     console.log("len", rowsdata.length)
            //     console.log("-----------------")
            //     resolve(rowsdata)
            //     return
            // }
            const distname = districts[district_id];
            let filename = "district-" + district_id + "-" + distname + ".json"
            let jsontext = fs.readFileSync("data/" + filename)
            let dist_items = process_district_page_data_json(district_id, distname, jsontext)
            rowsdata = rowsdata.concat(dist_items)
        }
        console.log("len", rowsdata.length)
        console.log("-----------------")
        resolve(rowsdata)
    });
}

exports.districts = districts;
exports.scrap_all_district_page = scrap_all_district_page;
exports.process_all_district_data = process_all_district_page_data;
exports.scrap_district_page = scrap_single_district_page;

// let html = fs.readFileSync("response.html", { encoding: 'utf8', flag: 'r' })
// process_html(html)