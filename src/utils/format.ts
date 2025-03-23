import moment from 'moment';

export const TIME = "HH:mm";
export const TIME_SECOND = "HH:mm:ss";
export const MONTH_YEAR_DATE = "MMM YYYY";
export const LONG_DATE = "DD MMMM YYYY";
export const LONG_DATE_TIME = "YYYY-DD-MM HH:mm:ss";
export const LONG_MONTH_DAY_TIME = "YYYY-MM-DD HH:mm:ss";
export const TIME_DATE_LONG = "HH:mm DD MMMM YYYY";
export const YEAR = "YYYY";
export const YEAR_MONTH_DATE = "YYYY-MM-DD";
export const YEAR_DATE_MONTH = "YYYY-DD-MM";
export const LONG_DATE_SLASH = "DD/MM/YYYY";

export const formatDateTimeVietnamese = (date: Date) => {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const day = days[date.getDay()];
    const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return `${day}, ${dateStr} ${timeStr}`;
};
export const getFirstDayOfMonth = (date?: Date) => {
    const baseDate = date || new Date();
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
};

export const getLastDayOfMonth = (date?: Date) => {
    const baseDate = date || new Date();
    return new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
};
export const getTimeFromStartOfYearToNow = () => {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1); // Tháng 0 là tháng 1
    return {
        startOfYear,
        currentDate,
    };
};
export const formatDate = (date: string) => {
    return moment(date).format('DD/MM/YYYY');
};
export const formatDateUK = (date: Date )=> {
    return moment(date).format('YYYY-MM-DD');
};

export const formatDateTime = (date: string) => {
    return moment(date).format('DD/MM/YYYY HH:mm');
};
export const formatDateTimeSecon = (date: string) => {
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
};
export const formatCurrency = (currency: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(currency));
};
export const renameProductType = (type: string) => {
    switch (type) {
        case 'clothings':
            return 'Quần áo';
        case 'electronic':
            return 'Điện tử';
        default:
            return 'Khác';
    }
};
export const renameStatusProduct = (status: string) => {
    switch (status) {
        case 'Published':
            return 'Công khai';
        case 'Draft':
            return 'Nháp';
        default:
            return 'Khác';
    }
};
