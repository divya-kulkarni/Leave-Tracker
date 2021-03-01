import {startOfDay,startOfMonth,startOfWeek,endOfWeek,endOfMonth,addDays} from 'date-fns';

/**
 * Helper file to used to generate week(array of dates), and month(2D array of dates) 
 * 
 * 
 *  genWeek(start) :a generator function which returns a function that gives array of dates of the week from which 'start' is from.
 * 
 * genMonth(start) : a generator function that returns a function which returns an array of array containing all dates of the month of 'start'
 * 
 */

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
