//Pulls table with reservation info from database.
//and calls function to create table on page.

 paeatea
let eventId = 173;
console.log(eventId);

let resvTable = async function(eventId){
  try {
    let table = await slot.eventSlotResv(eventId);
    createResvTable(table);
  }
  catch (err) {
    console.log(err);
  }
};

function createResvTable(table){
  console.log("test");
};

resvTable(eventId);
