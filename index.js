const express = require('express');
const moment = require('moment');
const bodyParser = require('body-parser');
// create express app
const app = express();
// Setup server port
const port = process.env.PORT || 5000;
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
// define a root route
app.get('/', (req, res) => {
  res.send("Hello World");
});
// Require employee routes
const districtDoseRoutes = require('./src/routes/district_dose.routes')
const districtAefiRoutes = require('./src/routes/district_aefi.routes')
// using as middleware
app.use('/api/district_dose', districtDoseRoutes)
app.use('/api/district_aefi', districtAefiRoutes)

app.set('json replacer', function (key, value) {
  if (this[key] instanceof Date) {
    if(key == "date"){
      value = moment(this[key]).format("YYYY-MM-DD");
    }else{
      value = moment(this[key]).format("YYYY-MM-DD HH:mm:ss");
    }
  }
  return value;
});

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});