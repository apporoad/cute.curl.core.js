var curl = require('./index')

// curl.invoke(['http://localhost:19999/123' , 'post' , 'aa=33&ddf=zzz' , 'silent'], {
//     headers: ['asdf:a' , 'ccc:222'],
//     verbose : false
// })



// curl.invoke(['http://localhost:19999/123' , 'post' , { abc :'hello', yes : 1} , 'silent'], {
//     headers: ['asdf:a' , 'ccc:222'],
//     verbose : false
// })


curl.cmd('http://localhost:19999/123' , {ac: 'hello good good day'}, 'post')