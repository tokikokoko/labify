const builder = require('electron-builder');

builder.build({
  config: {
    'appId': 'labify.app',
    "directories": {
      "output": "electronDist"
    },
    'win':{
      'target': {
        'target': 'nsis-web',
        'arch': [
          'x64',
        ]
      }
    }
  }
});