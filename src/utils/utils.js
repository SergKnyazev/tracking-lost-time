export const request = async (url, method = 'GET', data = null) => {
  try {
    const headers = {};
    let body;

    if (data) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    const response = await fetch(url, {
      method,
      headers,
      body
    })

    return await response.json()

  } catch (error) {
    const message = `ALERT! Function "request" (utils.js) : Request error url=${url} method=${method} : ${error.message}`
    console.log(message);
    throw Error({ message })
  }
}

export const formatDate = (date) => `${date.slice(6)}.${date.slice(4,6)}.${date.slice(0,4)}`;

export const formatDateRevers = (date) => `${date.slice(6)}${date.slice(3,5)}${date.slice(0,2)}`;
