# cute.curl.core.js
core of cute curl

# more like cute.curl.core
https://github.com/apporoad/cute.curl.js

## dev
```bash
npm i -g aok.js

aok test -p 19999

node test


```


## how to use
```bash
npm i -S cute.curl.core
```

```js
var ccurl = require('cute.curl.core')



```

## preInvoke
```js
curl.invoke(['http://localhost:19999/123' , 'post' , { abc :'hello', yes : 1} , ''], {
    headers: ['asdf:a' , 'ccc:222'],
    verbose : false,
    //defaultMethod ， useful when no method
    defaultMethod : 'post',
    // force method 
    method : 'get',
    preInvoke : function(invokeObj){
        console.log(invokeObj.url)
        console.log(invokeObj.data)
        console.log(invokeObj.method)
        console.log(invokeObj.options)
        invokeObj.data['abc'] = 'yyyyyy'
    }
})

```