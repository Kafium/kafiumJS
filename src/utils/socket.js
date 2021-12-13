function waitForData(socket, waitingData) {
  return new Promise((resolve, reject) => {
      socket.on('message', listener)

      function listener(data) {
          if(data.toString().includes(waitingData)) {
              resolve(data)
              socket.removeListener('message', listener)
          }

          if(data.toString().startsWith('Error')) {
              reject(data.toString().replace('Error:', ''))
              socket.removeListener('message', listener)
          }
      }
      
      wait(5000).then(() => {
          reject('TIMEOUT')
          socket.removeListener('data', listener)
      })
  })
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = { waitForData }