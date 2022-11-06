export async function verifiedUrl(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'HEAD',
            url: url,
            onload(res: GM.Response<any>) {
                resolve(res.status == 200)
            },
            onerror(err: GM.Response<any>) {
                reject(err)
            }
        })
    })
}