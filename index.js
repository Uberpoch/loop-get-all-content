const axios = require('axios');
const fs = require('fs');


const clientID = '';
const secretKey = '';

const outputFile = 'triple-lift-june4';




const auth = async (key, secret) => {
    return axios.post('https://v2.api.uberflip.com/authorize', {
        grant_type:	'client_credentials',
        client_id: key,
        client_secret: secret
    })
    .catch(function (error) {
        console.log(error);
        })
    .then(function (response) {
        // tokenType = response.data.token_type;
         const token = response.data.access_token;
        // console.log(token);
        return token;
    });

}


const callLoop = async function(token){
    let url = 'https://v2.api.uberflip.com/items?limit=100&page=1';
    let returnedItems = [];
    let totalItems;
        
    async function call(url, token){
    axios.get(url, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'User_Agent': `Nathan UF`
              }
        })
        .catch(error => {
            console.log(error);
            })
        .then(res => {
            let next = res.data.meta.next_page;
            // let prev = res.data.meta.prev_page;
            // console.log(next);
            let objs = res.data.data;
            // console.log(objs);
            // let array = [];
            
            objs.forEach(obj => returnedItems.push(obj));

                if(totalItems !== returnedItems.length){
                    totalItems = res.data.meta.count;
                    console.log(`returnedItems: ${returnedItems.length}, totalItems: ${totalItems}`);
                    call(next,token);
                }
                else {
                    console.log(`returnedItems: ${returnedItems.length} = totalItems: ${totalItems}`);
                    console.log(`creating file`);
                    generateFile(returnedItems)
                }
            
        });   

    }
    if(totalItems === undefined){
        call(url,token);
    }
}

const  generateFile = async(res) => {
    const allowArray = [
        "id",
        "title",
        "description",
        "url",
        "seo_title",
        "seo_description",
        "thumbnail_url",
        "content",
        "stream_id"
    ];
    let data = JSON.stringify(res, null, 2);
    fs.writeFileSync(`${outputFile}.json`, data);
    console.log('json created');
  };

const run = async function(){
    const token = await auth(clientID, secretKey);
    // console.log(token);
    console.log('token created');
    const data = await callLoop(token);
    // console.log(data.length);
    console.log('data confirmed');
    // await generateFile(data);

};
run();