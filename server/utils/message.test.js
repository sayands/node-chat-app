var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = "Sayan";
        var text = "Hey"
        res = generateMessage(from,text);
        
        expect(res.createdAt).toBeA('number');
        expect(res).toInclude({from,text});
    });
});

describe('generateLocationMessage', () => {
   it('should generate correct location message', () => {
       var from = "Admin";
       var lat = 1;
       var lng = 1;
       var url = `https://www.google.com/maps?q=${lat},${lng}`;
       
       var res = generateLocationMessage(from,lat,lng);
       
        expect(res.createdAt).toBeA('number');
        expect(res).toInclude({from,url});
   }); 
});