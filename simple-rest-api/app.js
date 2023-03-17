import express from "express";
var app = express();

import sqlite3 from 'sqlite3';
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE jsonTable (json TEXT)')
  const stmt = db.prepare('INSERT INTO lorem VALUES (?)')

   for (let i = 0; i < 10; i++) {
   stmt.run(`Ipsum ${i}`)
  }

 let json = {"test": "1", "test ": 2};

 // db.run('INSERT INTO jsonTable (json) VALUES (' + JSON.stringify(json) +')');

 db.run('INSERT INTO jsonTable (json) VALUES (?)', [JSON.stringify(json)], function(err) {
  if (err) {
    return console.log(err.message);
  }
  // get the last insert id
  console.log(`A row has been inserted with rowid ${this.lastID}`);
});
})

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/json", (req, res, next) => {

    let result = [];
   db.each('SELECT json FROM jsonTable', (err, row) => {
    console.log(err);
    if(err){
      return console.log(err.message);
    }
    result.push(JSON.parse(row));
  })
    console.log(result);
    res.json(result);
});

 process.stdin.resume();//so the program will not close instantly

 function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    db.close();
   if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
 }
 //do something when app is closing
 process.on('exit', exitHandler.bind(null,{cleanup:true}));

 //catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

 // catches "kill pid" (for example: nodemon restart)
 process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
 process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

  //catches uncaught exceptions
 process.on('uncaughtException', exitHandler.bind(null, {exit:true}));