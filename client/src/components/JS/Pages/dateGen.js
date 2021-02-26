import {startOfDay,startOfMonth,startOfWeek,endOfWeek,endOfMonth,addDays} from 'date-fns';

export function genWeek(start = new Date()){
    let date = startOfWeek(startOfDay(start),{weekStartsOn:1});

    return function(){
        const week = [...Array(7)].map((_,i)=> addDays(date ,i));
        date = addDays(week[6],1);
        return week;
    };
}

export function genMonth(start = new Date()){
    let month = [];
    let date = start;

    function lastOfMonth(mnt){
        return mnt[mnt.length-1][6];
    }

    return function(){
        const weekGen = genWeek(startOfMonth(date));
        const lastdate = startOfDay(endOfWeek(endOfMonth(date),{weekStartsOn:1}));

        month.push(weekGen());

        while(lastOfMonth(month) < lastdate)
        {
            month.push(weekGen());
        }

        date = addDays(lastOfMonth(month),1);
        const currMonth = month;
        month = [];
        return currMonth;
    
    }
}
