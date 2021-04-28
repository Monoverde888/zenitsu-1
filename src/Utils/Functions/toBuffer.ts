import toArray from './toArray.js'
import stream from 'stream';
function poto(...args: any) {
    return args
}

function toBuffer(stream: stream, callback: typeof poto) {
    toArray(stream, function (err, arr) {
        if (err || !arr)
            callback(err)
        else
            callback(null, Buffer.concat(arr))
    })

    return stream
}

export default toBuffer