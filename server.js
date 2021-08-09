const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(__dirname +  '/dist/reservation-calendar'));

app.get('/*', (req, res) => 
  res.sendFile(__dirname + '/dist/reservation-calendar/index.html')
);

app.listen(port, function() {
  console.log("App is running on port " + port);
});