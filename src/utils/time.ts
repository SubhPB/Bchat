// Byimaan

class MSOperation {
    incrementOneHour(ms: number){
        return ms + (1000 * 60 * 60)
    }

    incrementHours(ms: number, hours: number){
        if (hours < 0){
            throw new Error(`Invalid input, Can't perform decrement in an increment operation. Expected hours > 0 but got ${hours}`)
        };
        return ms + (hours * 1000 * 60 * 60)
    };
}

class MilliSeconds {

    public operation: MSOperation;
    constructor(private ms: number){
        this.ms = ms;
        this.operation = new MSOperation()
    };

    now(){
        this.ms = Date.now();
        return this;
    }

    toDate(){
        return new Date(this.ms)
    };

    toYear(){
        return (this.toDate()).getUTCFullYear();
    };

    toMonth(){
        return (this.toDate()).getUTCMonth() + 1
    };

    toDayOfTheMonth(){
        return (this.toDate()).getUTCDate() 
    };

    toDayOfTheWeek(){
        return (this.toDate()).getUTCDay()
    };
    
    toHours(){
        return (this.toDate()).getUTCHours()
    };

    toMinutes(){
        return (this.toDate()).getUTCMinutes();
    };

    toSeconds(){
        return (this.toDate()).getUTCSeconds();
    };

    age(){
        const age =  Date.now() - this.ms;
        if (age < 0){
            throw new Error(`An age can never be in negative`)
        };
        return age
    };

    isOlderThan(_ms: number){
        return this.ms < _ms
    };

};

class TimeFeatures {

    static async holdOn(ms: number){
        return await new Promise(
            (res, _rej) => {
                setTimeout(
                    () => res('Time is up!'), ms
                )
            }
        )
    };

}



export {MilliSeconds, TimeFeatures}