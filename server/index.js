const express = require("express");
const path = require('path');
const PORT = process.env.PORT || 8080;
const {BigQuery} = require('@google-cloud/bigquery');
bigquery_opt = {
    projectId:'kp031-trainee-catellocasillo', 
    keyFilename:'/home/rosariocatello/.config/gcloud/application_default_credentials.json'
}

const bigquery = new BigQuery(bigquery_opt);
const bodyParser = require('body-parser');
const app = express();

function convert_date(input_date){
    let date = [input_date.getFullYear(), input_date.getMonth()+1, input_date.getDate()].join("-")
    let clock = [input_date.getHours(), input_date.getMinutes(), input_date.getSeconds()].join(":")
    return [date, clock].join(" ")
}

function convert_date_millisecond(input_date){
    let date = [input_date.getFullYear(), input_date.getMonth()+1, input_date.getDate()].join("-")
    let clock = [input_date.getHours(), input_date.getMinutes(), input_date.getSeconds()].join(":")
    let milliseconds = input_date.getMilliseconds()
    return [[date, clock].join(" "), milliseconds].join(".")
}


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"../client/build")));

/*
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://triple-hour-287219.uc.r.appspot.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
*/

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.get("/api", (req, res) => {

    let start_date = convert_date(new Date(req.query.start_date))
    let end_date = convert_date(new Date(req.query.end_date))

    console.log(start_date)
    console.log("GET request arrived")

    async function query() {

        const query = "SELECT generation_ts, pre_elab_ts, insertion_ts, process_number "+ 
                      "FROM \`kp031-trainee-catellocasillo.smart_car.measure_latency\` "+ 
                      "WHERE generation_ts >=DATETIME('" +start_date+ "') and generation_ts <=DATETIME('"+end_date+"')"+
                      "ORDER BY generation_ts ASC "
                      "LIMIT 10";

        const options = {
            query: query,
            location: 'EU',
            
          };
      
          const [job] = await bigquery.createQueryJob(options);
          console.log(`Job ${job.id} started.`);
          const [rows] = await job.getQueryResults();  
          res.status(200).json(rows);
          //res.send(JSON.stringify({"status":200, "error":null, "response":rows}))
        
      }
    query()
});

app.post("/simulateData", (req, res)=>{
    let pre_elab_ts = new Date() 
    row = [req.body].map((element)=>{
        
        let ins_row = {"car_id":element.car_id, 
                        "sensor_id":element.sensor_id, 
                        "value":element.value_id, 
                        "generation_ts": convert_date(new Date(element.generation_ts)),
                        "pre_elab_ts": convert_date_millisecond(pre_elab_ts),
                        "post_elab_ts": convert_date_millisecond(new Date())
                        } 
        return ins_row 
    })
    console.log(row)
    bigquery.dataset('smart_car').table('measure_latency').insert(row).then(()=>console.log('Inserted '+row.length+' rows'))
    res.sendStatus(200);
});

app.get("/carIDList", (req, res)=>{
    console.log("Car Ids Requested")
    async function query() {

        const query = "SELECT DISTINCT car_id "+ 
                      "FROM \`kp031-trainee-catellocasillo.smart_car.measure_latency\` "+ 
                      "ORDER BY car_id ASC "+
                      "LIMIT 10";

        const options = {
            query: query,
            location: 'EU',
            
        };
      
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);
        const [rows] = await job.getQueryResults();  
        let carIDs = rows.map((carId)=>carId.car_id)
        console.log(carIDs)
        res.status(200).json(carIDs);
    }
    query()
})

app.get("/sensorIDList", (req, res)=>{
    console.log("Sensor Ids Requested")
    async function query() {

        const query = "SELECT DISTINCT sensor_id "+ 
                      "FROM \`kp031-trainee-catellocasillo.smart_car.measure_latency\` "+
                      "WHERE car_id='"+req.query.car_id.toString()+"' " +
                      "ORDER BY sensor_id ASC "+
                      "LIMIT 10";

        const options = {
            query: query,
            location: 'EU',
            
        };
        console.log(query)
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);
        const [rows] = await job.getQueryResults();  
        console.log(rows)
        let sensorIDs = rows.map((sensorID)=>sensorID.sensor_id)
        console.log(sensorIDs)
        res.status(200).json(sensorIDs);
    }
    query()
})


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});