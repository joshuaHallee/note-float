const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;
app.use(express.static(__dirname));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyParser.json())
app.use(bodyParser.json());

var script = require('./script.js');

//GET LINKS
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', function(req, res) {
  res.sendFile(__dirname + '/index.html');
  app.use(express.static(__dirname));
});

app.get('/send.html', function(req, res) {
  res.sendFile(__dirname + '/send.html');
  app.use(express.static(__dirname));
});

app.get('/recieveMessage', function(req, res) {
  res.sendFile(__dirname + '/recieve.html');
  app.use(express.static(__dirname));
});

app.get('/verify.html', function(req, res) {
  res.sendFile(__dirname + '/verify.html');
  app.use(express.static(__dirname));
});

app.get('/email', function(req, res, next){
  res.sendFile(__dirname + '/verify.html');
});

//RECIEVE
app.post('/sendMessage', function(req, res) {
  res.sendFile(__dirname + '/send.html');
  console.log(req.body.message.toString() + " in post");
  script.sendMessage(req.body.message.toString());
});

app.get('/recieveMessage', function(req, res) {
  res.sendFile(__dirname + '/recieve.html');
});

app.post('/recieveMessage', function(req, res) {
  const AWS = require('aws-sdk');
  AWS.config.update({region: 'us-east-1'});
  const docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: "messages",
    KeyConditionExpression: "#mess = :num",
    ExpressionAttributeNames: {
      "#mess": "messageID"
    },
    ExpressionAttributeValues: {
      ":num": "1"
    }
  };
  docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        res.send(JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        console.log("Read Message", data);
          res.send(JSON.stringify(data.Items));
        // data.Items.forEach(function(item) {
        //     console.log(" -", item.messageID + ": " + item.createdByID);
        // });
    }
  });
});

//VERIFY
app.post('/email', function(req, res, next) {
  //console.log(req.body);
  res.sendFile(__dirname + '/verify.html');
  script.sendEmail(req.body.email.toString());
});

app.post('/phone', function(req, res) {
  res.sendFile(__dirname + '/verify.html');
  script.sendPhone(req.body.phone.toString());
})

app.listen(port, function() {
  console.log(`listening on port ${port}`)
});
