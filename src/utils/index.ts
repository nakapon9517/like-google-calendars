import dayjs from 'dayjs';
import ja from 'dayjs/locale/ja';

export const dateFormat = (date: Date) => dayjs(date).locale(ja).format('YYYY-MM-DD');
