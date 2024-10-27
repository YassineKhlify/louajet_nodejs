const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());

const admin = require('firebase-admin');
const serviceAccount = require('./loujet-2c6fe-firebase-adminsdk-v3zwh-42f072412f.json'); // Download this from your Firebase project settings

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://loujet-2c6fe-default-rtdb.europe-west1.firebasedatabase.app/'
});

const db = admin.database();
const assaignTravelerToDriver = async (req, fillingDriver)=>{

}

app.post('/abandonQueue', async (req, res) => {
    const userId = req.body.userId;
    const destination = req.body.destination
  
    try {
      const queueRef = db.ref('destinations/'+destination+'/Queue');
      const nextRgRef = db.ref('destinations/'+destination+'/NextRg');
      const userRef = db.ref('users/'+userId);




      const snapshot = await queueRef.once('value');
      const nrsnapshot = await nextRgRef.once('value');
      const userSnapshot = await userRef.once('value');

      let NextRg = nrsnapshot.val();
      let queue = snapshot.val();
      let user = userSnapshot.val();
      let me;
    
      // Iterate over the queue and decrement rang for all users except the user sending the request
      for (let key in queue) {
        if (key == userId){
           me = queue[key];
        }
      }
      
      for (let key in queue) {
        if (key !== userId) {
            if (me.rang<queue[key].rang){
                queue[key].rang -= 1;
            }
        }
      }
      delete user.rang;
      delete user.inQueue;
      delete queue[userId];
      NextRg -= 1;
      



      // write the desired code here


      await queueRef.set(queue);
      await nextRgRef.set(NextRg);
      await userRef.set(user);

      
      res.status(200).send(queue);
    } catch (error) {
      console.error('Error :', error);
      res.status(500).send('Internal Server Error');
    }
  });
app.post('/reserve', async (req, res) => {
  const userId = req.body.userId;
  const destination = req.body.destination;
  const PlNd = req.body.PlNd;
  try {
    const NextTrRef = db.ref('drivers/NotDriver/'+destination+'/NextTr');
    const NextTrSnapshot = await NextTrRef.once('value');
    const NextTr = NextTrSnapshot.val();
    
    if (NextTr>1){
      const driversRef = db.ref('drivers');
      const driversSnapshot = await driversRef.once('value');
      const drivers = driversSnapshot.val();
      const driverIds = Object.keys(drivers);
      let fillingDriver;
      let reserveDriver;
      for (let driverId of driverIds){
        if (driverId!="NotDriver"){
          const driverRef = driversRef.child(driverId);
          const driverSnapshot = await driverRef.once('value');
          const driver = driverSnapshot.val();
          if(driver.GoesTo==destination){
            if (driver.hasOwnProperty("Turn")){
              if (driver.Turn == 1){
                fillingDriver = driver;
              }
            }
          }

       }
      }
      console.log(fillingDriver.name + "is filling right now")
      console.log("he has places: "+fillingDriver.PlacesD)
      if (fillingDriver.PlacesD>=PlNd){
        console.log("its enough for me");
      }else{
        console.log('its not enough');
        if (NextTr>2){
          console.log("theres reserve driver")

        }else{
          console.log("no reserve driver, waiting in queue")

        }
      }
      return res.status(200).send(driverIds);


    }
    else{
      res.status(200).send('No drivers, adding to queue');
    }

  }
  catch (error){
    console.error(error);
    res.status(500).send('Internal Server Error');
  }

})
  // Start the server and listen on the specified port
app.listen(port, IP_ADDRESS, () => {
    console.log(`Server running at http://${IP_ADDRESS}:${port}/`);
  });
  