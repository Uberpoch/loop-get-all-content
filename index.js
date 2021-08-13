const axios = require('axios');
const fs = require('fs');
const commandLineArgs = require('command-line-args');

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


const call = async (token, url) => {
    return await axios.get(url, 
        {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'User_Agent': `Nathan UF`
            }
        })
        .catch(error => {
            console.log(error);
            })
        .then(res => {
            return res.data;
        });   
}
const callLoop = async(token) => {
    let url = `https://v2.api.uberflip.com/items?limit=100`;
    let page = 0;
    let totalPages = 0;
    let array = [];

    do{
        let res = await call(token, url);
        totalPages = res.meta.total_pages;
        page++;
        url = res.meta.next_page;
        console.log(`getting: page ${page} of ${totalPages}`);
        array = array.concat(res.data);
        console.log("array.length:", array.length);
    }while(page < totalPages);
    return array;
}

const  generateFile = async(res, file) => {
    let data = JSON.stringify(res, null, 2);
    fs.writeFileSync(`${file}.json`, data);
    console.log('json created');
  };

const run = async(argv) => {
    const optionDefinitions = [
      { name: 'nocommit', type: Boolean },
      {
        name: 'key',
        type: String,
      },
      {
        name: 'sec',
        type: String,
      },
      {
        name: 'file',
        type: String,
      },
    ];
  
    // defining commandline variables
    const options = commandLineArgs(optionDefinitions, { argv });
    const apiKey = options.key; //--key
    const apiSecret = options.sec; //--sec
    const file = options.file; //--hub

  console.log(options);
    // warning for missing commandline arguments
    if (options.nocommit) {
      console.warn('--nocommit was supplied.');
    }
  
    if (apiKey === undefined ) {
      console.error('no apikey was supplied please follow this format $node index.js run --key ENTERAPIKEY --sec ENTERFEEDURL. --file FILENAME');
      return;
    }
    if (apiSecret === undefined ) {
        console.error('no apikey was supplied please follow this format $node index.js run --key ENTERAPIKEY --sec ENTERFEEDURL. --file FILENAME');
        return;
    }
    if (file === undefined ) {
        console.error('no apikey was supplied please follow this format $node index.js run --key ENTERAPIKEY --sec ENTERFEEDURL. --file FILENAME');
    return;
    }
  
    // get all tags
    const token = await auth(apiKey, apiSecret);
    console.log('token created');
    const data = await callLoop(token);
    console.log('data confirmed');
    await generateFile(data, file);
    console.log('generated file');
  };

const main = () => {
    // These first few lines are just configuration
    const mainOptionDefinitions = [{ name: 'command', defaultOption: true }];
    const mainOptions = commandLineArgs(mainOptionDefinitions, {
      stopAtFirstUnknown: true,
    });
    const commandOptions = mainOptions._unknown || [];
    // Creates cases for the different commands you might pass
    switch (mainOptions.command) {
      // The case here refers to the COMMAND you pass after the file name
      case 'run':
        return run(commandOptions);
      default:
        // Will notify that no command was provided
        console.error(`Unknown command '${mainOptions.command}'.`);
        return null;
    }
  };
  
  main();