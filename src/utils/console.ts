// BYIMAAN

class Log {

    red = '\x1b[31m%s\x1b[0m'
    green = '\x1b[32m%s\x1b[0m'
    yellow = '\x1b[33m%s\x1b[0m'
    blue = '\x1b[34m%s\x1b[0m'
    magenta = '\x1b[35m%s\x1b[0m'
    cyan = '\x1b[36m%s\x1b[0m'
    white = '\x1b[37m%s\x1b[0m'

    private exec(colorCode: string, ...args: any){
        try {
            console.log(colorCode, ...args)
        } catch {
            console.log(this.yellow, '_console._log failed to apply color');
        }
    }

    doRed(...args: any){
        this.exec(this.red, ...args)
    }

    doGreen(...args: any){
        this.exec(this.green, ...args)
    }

    doYellow(...args: any){
        this.exec(this.yellow, ...args)
    }

    doBlue(...args: any){
        this.exec(this.blue, ...args)
    }
    
    doMagenta(...args: any){
        this.exec(this.magenta, ...args)
    }

    doCyan(...args: any){
        this.exec(this.cyan, ...args)
    }

    doWhite(...args: any){
        this.exec(this.white, ...args)
    }
}

class Console {
    _log : Log = new Log()
};

const _console = new Console();

export {_console}