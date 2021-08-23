var req  = require('mini.req.js')
var qs = require('querystring')
var hparse = require('parse-headers')
var fs = require('fs')
var path = require('path')


function powerParse(str){
    try{
        return JSON.parse(str)
    }catch{
        var value = null
        eval('value = ' + str)
        return value
    }
}

function isJson(obj){
	var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; 
	return isjson;
}

function resolveMsg(msg){
    return isJson(msg) ? JSON.stringify(msg) : msg
}

function resolveMsgEx (msg,fn){
    if(msg && msg.then){
        msg.then(function(d){
            fn(resolveMsg(d))
        })
    }else{
        fn(resolveMsg(msg))
    }
}

/**
 * 处理头
 * @param {*} headers 
 * @returns 
 */
var resolveHeaders = function(headers){
    if(!headers){
        return null
    }
    if(headers.length > 0){
        // var harray = headers.split(/[;,&]/g)
        return hparse(headers.join('\n'))
    }
    return headers
}

exports.invoke = async function(cmds , options){
    options = options || {}

    options.output = options.output || null
    options.headers = resolveHeaders(options.headers)
    options.verbose = options.verbose  || false

    var extObject = null
    if(options.ext){
        // ext.js 
        var realPath = path.resolve(process.cwd(), options.ext)
        if(fs.existsSync(realPath)){
            var value = require(realPath)
            if(typeof value == "function"){
                extObject = {
                    resultHandler : value
                }
            }else{
                extObject = value
            }
        }else{
            var vaule = null
            try{
                eval('value = ' + options.ext)
                if(typeof value == "function"){
                    extObject = {
                        resultHandler : value
                    }
                }else{
                    extObject = value
                }
                
            }catch(ex){
                console.error('ext error :  ext语句错误，请检查' )
                throw ex
            }
        }
    }

    var handlerOptions = Object.assign({}, options)
    var url = null
    var method = 'get'
    var data = null

    cmds.forEach(oneStr => {
        if(!oneStr){
            return
        }
        if(typeof oneStr == 'object'){
            //默认为参数
            data = oneStr
            return 
        }
        oneStr = oneStr.trim()
        //先判断是否是方法
        switch(oneStr.toLowerCase()){
            case 'slient':
            case 'silent':
            case 's':
                options.slient = true
                break
            case 'get':
            case 'post':
            case 'delete':
            case 'put':
                method = oneStr.toLowerCase()
                break
            case 'del':
                method = 'delete'
                break
            default:
                var lowerCase = oneStr.toLowerCase()
                //是否是url  "http://"  http:
                if(oneStr.indexOf('>') == 0){
                    options.output = oneStr
                }else if(lowerCase.indexOf('http') >-1 && lowerCase.indexOf('http') < 2 && lowerCase.indexOf(':') > -1){
                    url = oneStr
                }else{
                    //剩余的就是数据
                    data = oneStr
                    //文件判断
                    var realPath = path.resolve(process.cwd(), data)
                    if(fs.existsSync(realPath)){
                        var encoding = options.encoding || 'utf8'
                        data = fs.readFileSync(realPath,encoding)
                    }
                    if(data){
                        // form json 判断
                        if(data.indexOf('{') == 0){
                            data = powerParse(data)
                        }else{
                            data = qs.parse(data)
                            options.type = 'form'
                        }
                    }
                    
                }
                break
        }
    });

    if(!url){
        console.error('you must give a : url')
        throw new Error('you must give a : url')
    }

    if(options.verbose){
        console.log('url : ' + url)
        console.log('method : ' + method.toUpperCase())
        console.log('data : ' + resolveMsg(data))
    }

    handlerOptions.url = url
    handlerOptions.method = method
    handlerOptions.data = data
    
    try{
        var data = await req(url, method, data ,options)
        var odata = data
        // console.log(extObject)
        if(extObject && extObject.resultHandler){
            odata = extObject.resultHandler(data,handlerOptions) || data
        }
        if(options.output){
            resolveMsgEx(odata,function (d) {
                writeFile(options.output, d,options)
            })
        }else{
            // console.log('response : ' + resolveMsg(data))
            // console.log('+++++++++++')
            if(!options.slient){
                resolveMsgEx(odata,console.log)
            }
        }
        return data
    }catch(ex){
        if(!options.slient){
            console.error(resolveMsg(ex))
        }else{
            if(options.verbose){
                console.error(resolveMsg(ex))
            }
        }
        throw ex
    }
}

function writeFile(output,content,options) {
    var isAppend = false
    if(output.indexOf('>>') == 0){
        isAppend = true
    }
    var filename = output.replace(/>/g,'')
    var realPath = path.resolve(process.cwd(), filename)
    if( isAppend && fs.existsSync(realPath)){
        fs.appendFile(realPath, content , function (err) {
            if (err) throw err;
            if(!options.slient)
                console.log('append to :' + realPath);
          });
    }else{
        fs.writeFileSync(realPath, content)
        if(!options.slient)
            console.log('write to :' + realPath)
    }
}


exports.cmd = async function(...cmds){
    return exports.invoke(cmds)
}