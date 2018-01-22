console.log(process.argv.slice(2).reduce((x,y) => {
    x = parseInt(x)
    return x += parseInt(y)
}))