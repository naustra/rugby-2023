const stagingConfig = {}

const productionConfig = {
  apiKey: 'AIzaSyBzlTB9UjDQDpFMoDnAmo2m4Z6fqNUTvVE',
  authDomain: 'rugby-2023-e5f84.firebaseapp.com',
  projectId: 'rugby-2023-e5f84',
  storageBucket: 'rugby-2023-e5f84.appspot.com',
  messagingSenderId: '903319843295',
  appId: '1:903319843295:web:d2ecdc7fe03ec8a523546a',
  vapidKey:
    'BKUX8X37Ln6RYbXTwFpuAZBoQabfMFZNie2gF9ZVT9guHA4uqQiCbwrLwXB-XTEBhOFbzMwgAlQH1U70QHcSa0k',
}

if (process.env.REACT_APP_DATABASE === 'PRODUCTION') {
  module.exports = productionConfig
} else {
  module.exports = productionConfig
}
