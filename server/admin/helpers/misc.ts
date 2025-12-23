import dayjs from "dayjs";
import { DATEFILTERS } from "admin/constants";

export const getQueryDateRange = (numberOfDays: number) => {
    return {
        start_date: new Date(
            new Date().setDate(new Date().getDate() - numberOfDays)
        ),
        end_date: new Date(),
    };
};

export const getDateRange = (reportPeriod: string) => {
    const now = dayjs();
    let start_date: number;
    let end_date: number;
    let timeline: string[];

    if (reportPeriod === DATEFILTERS.LastMonth) {
        const firstDayOfCurrentMonth = now.set("date", 1);
        let firstDayOfLastMonth = firstDayOfCurrentMonth.set(
            "month",
            firstDayOfCurrentMonth.month() - 1
        );

        const daysInMonth = firstDayOfLastMonth.daysInMonth();
        let timeArray = [];
        for (let i = 1; i <= daysInMonth; i++) {
            timeArray.push(firstDayOfLastMonth.date(i).format("DD MMM YY"));
        }
        timeline = timeArray;
        start_date = firstDayOfLastMonth.startOf("month").unix();
        end_date = firstDayOfLastMonth.endOf("month").unix();
    } else if (reportPeriod === DATEFILTERS.ThisMonth) {
        const firstDayOfCurrentMonth = now.set("date", 1);
        const lastDayOfCurrentMonth = now;
        const daysInMonth = firstDayOfCurrentMonth.daysInMonth();
        let timeArray = [];
        for (let i = 1; i <= daysInMonth; i++) {
            timeArray.push(firstDayOfCurrentMonth.date(i).format("DD MMM YY"));
        }
        timeline = timeArray;
        start_date = firstDayOfCurrentMonth.startOf("month").unix();
        end_date = firstDayOfCurrentMonth.endOf("month").unix();
    } else if (reportPeriod === DATEFILTERS.LastWeek) {
        const firstDayOfCurrentWeek = now.startOf("week");
        const lastDayOfLastWeek = firstDayOfCurrentWeek.set(
            "day",
            firstDayOfCurrentWeek.day() - 7
        );
        let timeArray = [];
        for (
            let i = lastDayOfLastWeek.get("date");
            i <= lastDayOfLastWeek.get("date") + 7;
            i++
        ) {
            timeArray.push(lastDayOfLastWeek.date(i).format("DD MMM YY"));
        }
        timeline = timeArray;
        end_date = firstDayOfCurrentWeek.unix();
        start_date = lastDayOfLastWeek.unix();
    } else if (reportPeriod === DATEFILTERS.ThisWeek) {
        let firstDayOfCurrentWeek = now.startOf("week");
        let timeArray = [];
        for (
            let i = firstDayOfCurrentWeek.get("date");
            i <= firstDayOfCurrentWeek.get("date") + 7;
            i++
        ) {
            timeArray.push(firstDayOfCurrentWeek.date(i).format("DD MMM YY"));
        }
        timeline = timeArray;
        start_date = firstDayOfCurrentWeek.unix();
        end_date = firstDayOfCurrentWeek.endOf("week").unix();
    }

    return {
        start_date: new Date(start_date * 1000),
        end_date: new Date(end_date * 1000),
        timeline,
    };
};

export const createUri = async (value: string) => {
    return value.replace(/ /g, "-")?.toLowerCase();
};
