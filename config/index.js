/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = {
       local: {
           mode:'local',
           port: 3001,
		   ipserver : '127.0.0.1',
           mongo: {
               host: '10.1.3.111',
               port: 27017,
               collection: 'report',
			   login : ''
           }
       },
       mbedq: { 
           mode:'production',
           port: 3001,
		   ipserver : '127.0.0.1',
           mongo: {
               host: '10.1.3.111',
               port: 27017,
               collection: 'mbedq',
			   login : ''
           }
       }
};

module.exports = function(mode) {
    return config[mode||process.argv[2]||'local'] || config.local;
};

//Add property on Mar 15,2017
module.exports.local = config.local;
	
module.exports.mbedq =config.mbedq;
