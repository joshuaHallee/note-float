module.exports = {

  sendEmail: function (email) {
    var AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});
    console.log(email);
    var params = {
      Destination: {
        ToAddresses: [
          `${email}`,
        ]
      },
      Message: {
        Body: {
          Html: {
           Charset: "UTF-8",
           Data: "Thank you for verify with Note Float"
          },
          Text: {
           Charset: "UTF-8",
           Data: "Thank you for verify with Note Float"
          }
         },
         Subject: {
          Charset: 'UTF-8',
          Data: 'Note Float Registration'
         }
        },
      Source: 'jthallee@email.neit.edu',
      ReplyToAddresses: [
        'jthallee@email.neit.edu',
      ],
    };
    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    sendPromise.then(
      function(data) {
        console.log(data.MessageId);
      }).catch(
        function(err) {
        console.error(err, err.stack);
      });
  },

  sendPhone: function (phone) {
    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});
    var sns = new AWS.SNS();
    var params = {
        Message: "Thank you for verifying with Note Float",
        MessageStructure: 'Message Structure',
        PhoneNumber: `${phone}`,
        Subject: 'your subject'
    };
    sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
  },

  sendMessage: function (message) {
    const AWS = require('aws-sdk');
    const fs = require('fs');

    AWS.config.update({region: "us-east-1"});

    var docClient = new AWS.DynamoDB.DocumentClient();
    //var allMessages = JSON.parse(fs.readFileSync('messages.json', 'utf8'), 1000);

    console.log(message + " in function");
      var params = {
        TableName: "messages",
        Item: {
          "messageID": "1",
          "createdByID": `${message}`
        }
      };

      docClient.put(params, function(err, data) {
        if (err) {
          console.log(err);
          console.error('unable to add message');
        } else {
          console.log('message successful');
        }
      });
  },






















  readMessage: function() {
    // console.log('read');
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
      } else {
          console.log("Query succeeded.");
          console.log("Read Message", data);
          return data.Items;
          // data.Items.forEach(function(item) {
          //     console.log(" -", item.messageID + ": " + item.createdByID);
          // });
      }
    });
  }
} //closes exports
