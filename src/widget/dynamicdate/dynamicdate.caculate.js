/**
 * 汇总表格帮助类
 * Created by Young's on 2017/1/19.
 */
!(function () {
    BI.DynamicDateHelper = {};
    BI.extend(BI.DynamicDateHelper, {
        getCalculation: function (obj) {
            var date = BI.getDate();
            if (BI.isNotNull(obj.year)) {
                date = BI.getDate((date.getFullYear() + BI.parseInt(obj.year)), date.getMonth(), date.getDate());
            }
            if (BI.isNotNull(obj.quarter)) {
                date = date.getAfterMulQuarter(obj.quarter);
            }
            if (BI.isNotNull(obj.month)) {
                date = date.getAfterMultiMonth(obj.month);
            }
            if (BI.isNotNull(obj.week)) {
                date = date.getOffsetDate(obj.week * 7);
            }
            if (BI.isNotNull(obj.day)) {
                date = date.getOffsetDate(obj.day);
            }
            if (BI.isNotNull(obj.workDay)) {
                // todo 根据工作日做偏移
            }
            if (BI.isNotNull(obj.position) && obj.position !== BI.DynamicDateCard.OFFSET.CURRENT) {
                date = this.getBeginDate(date, obj);
            }
            return date;
        },

        getBeginDate: function (date, obj) {
            if (BI.isNotNull(obj.day)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? BI.getDate(date.getFullYear(), date.getMonth(), 1) : BI.getDate(date.getFullYear(), date.getMonth(), (date.getLastDateOfMonth()).getDate());
            }
            if (BI.isNotNull(obj.week)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? date.getWeekStartDate() : date.getWeekEndDate();
            }
            if (BI.isNotNull(obj.month)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? BI.getDate(date.getFullYear(), date.getMonth(), 1) : BI.getDate(date.getFullYear(), date.getMonth(), (date.getLastDateOfMonth()).getDate());
            }
            if (BI.isNotNull(obj.quarter)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? date.getQuarterStartDate() : date.getQuarterEndDate();
            }
            if (BI.isNotNull(obj.year)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? BI.getDate(date.getFullYear(), 0, 1) : BI.getDate(date.getFullYear(), 11, 31);
            }
        }
    });
})();