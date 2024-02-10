const express = require('express')
const spawner = require('child_process').spawn
const { default: axios } = require('axios');
const twilio = require('twilio');


const GOOGLE_MAPS_API_KEY = "AIzaSyCI7xUVXdKdCUtFQGIT9TbYMQM2GN27gqg"
const accountSid = "AC85cc74a4a440bfcd82a87af3739e6aad";
const authToken = "9fdff760d22717e78193a97de08d78bf";
const twilioNumber = "+1-415-523-8886";

const client = new twilio(accountSid, authToken);



async function workflow(category,latitude,longitude){

    const radius = 1500;
    //workflow for different emergencies
    var places = []
    if (category == "medical") {
        places.push("hospital")
    }
    else if (category == "criminal") {
        places.push("police")
    }
    else if (category == "fire") {
        places.push("fire_station")
        places.push("hospital")
    }
    else if (category == "accident") {
        places.push("hospital")
        places.push("police")
    }
    let locations;
   for(let i=0;i<places.length;i++)
   {
    locations = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${places[i]}&key=${GOOGLE_MAPS_API_KEY}`).then(data => data.data.results)
   }
    res.json(locations)
    
    //send messages/alerts to emergency organisations
    client.messages.create({
        body: `User is in danger, current location: ${latitude},${longitude}`,
        to: '+917021746420', // Text this number
        from: '+18447174563', // From a valid Twilio number
      });
    
    //call emergency contacts 
    const contact='+919326227834'
    const messagePromises = emergencyContacts.map((contact) => {
        return client.calls.create({
          url: "https://demo.twilio.com/welcome/voice/",
          from: "+18447174563",
          to: "+91" + contact,
        });
      });
      console.log("Message Promises: ", messagePromises);
      await Promise.all(messagePromises);
    console.log(locations)
    //getting the first location coordinates of location array
    // let latitude2=req.body.latitude
    // let longitude2=req.body.longitude

    }