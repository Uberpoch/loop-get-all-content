const axios = require('axios');
const fs = require('fs');


const clientID = '';
const secret = '';

let token = '';

const desinationHub_id = 113214;
const outputFile = 'ABM-APJ-EMEA-3';
const toppage = 15;

var returnedItems = [];



axios.post('https://v2.api.uberflip.com/authorize', {
        grant_type:	'client_credentials',
        client_id: clientID,
        client_secret: secret
    })
    .catch(function (error) {
        console.log(error);
        })
    .then(function (response) {
        // tokenType = response.data.token_type;
        token = response.data.access_token;
        // console.log(response);
        callLoop(desinationHub_id, )
    });

const callLoop = async function(hub,){
    let totalPages = toppage
    for(let i = 1; i <= totalPages; i++) {
        axios.get(`https://v2.api.uberflip.com/hubs/${hub}/streams?limit=100&page=${i}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'User_Agent': `Nathan UF`
              }
        })
        .catch(function (error) {
            console.log(error);
            })
        .then(function (response) {
            totalPages = response.data.meta.total_pages;
            let objs = response.data.data;
            objs.forEach(function (obj) {
                returnedItems.push(obj);
            })
            // console.log(returnedItems);
            // console.log(totalPages);

        });   

      }
    
      setTimeout(function(){ generateFile(returnedItems); }, 8000);
}

const  generateFile = async(res) => {
    let data = JSON.stringify(res);
    fs.writeFileSync(`${outputFile}.json`, data);
    console.log('json created');
  };