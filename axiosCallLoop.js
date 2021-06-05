const { axiosCalls } = require('./axiosCall.js.js');

exports.axiosCallLoop = async(apiKey, isBlogApi) => {
  const array = [];
  const threehundred = 300;
  const zero = 0;
  let totalItems = 1; //eslint-disable-line no-magic-numbers
  let rootURL = '';
  let run = null;

  if (isBlogApi) {
    rootURL = 'https://api.hubapi.com/cms/v3/blogs/posts';
    run = (item) => array.push(item);
   } else {
    rootURL = 'https://api.hubapi.com/cms/v3/blogs/tags';
    run = (item) => array.push({ [item.id]: item.name });
  }

  for (let offset = zero; offset < totalItems; offset = offset + threehundred) {
    const url = `${rootURL}?hapikey=${apiKey}&limit=300&offset=${offset}`;
    let response = [];
    try {
      response = await axiosCalls(url); //eslint-disable-line no-await-in-loop
    } catch (err) {
      console.error('axios call loop ran into an error');
      console.log(err);
      throw err;
    }
    response.data.objects.forEach((blogInfo) => run(blogInfo));
    totalItems = response.data.total;
  }

  return array;
};
