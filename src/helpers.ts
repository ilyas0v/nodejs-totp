import * as QRCode from 'qrcode'

export const urlToQRCode = (url: string, callback: Function) => {
    return QRCode.toDataURL(url, (err: any, dataUrl: string) => {
        if(err) throw err
        callback(dataUrl)
    });
}
