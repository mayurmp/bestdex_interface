const logSwapInfo = async (params: any) => {
  const API_PATH = process.env.REACT_APP_API_KEY || ''
  try {
    await fetch(API_PATH + '/swap', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      //credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(params),
    })
  } catch (error) {
    console.log('from log', error)
  }
}

export default logSwapInfo
