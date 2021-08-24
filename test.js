var curl = require('./index')

// curl.invoke(['http://localhost:19999/123' , 'post' , 'aa=33&ddf=zzz' , 'silent'], {
//     headers: ['asdf:a' , 'ccc:222'],
//     verbose : false
// })



curl.invoke(['http://localhost:19999/123' ,'put' , { abc :'hello', yes : 1} , ''], {
    headers: ['asdf:a' , 'ccc:222'],
    verbose : false,
    preInvoke : function(invokeObj){
        console.log(invokeObj.url)
        console.log(invokeObj.data)
        console.log(invokeObj.method)
        console.log(invokeObj.options)
        invokeObj.data['abc'] = 'yyyyyy'
    },defaultMethod : 'post',
    method : 'get'
})


// curl.cmd('http://localhost:19999/123' , {ac: 'hello good good day'}, 'post')

// var abc = async ()=>{
//     var data = await curl.cmd('http://localhost:19999/123' , {ac: 'hello good good day'}, 'post' , 's')

//     console.log(JSON.stringify(data))
// }

// abc()