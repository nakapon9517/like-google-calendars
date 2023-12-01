export type CalendarItem = {
  id: string;
  /** 表示順(日付内) */
  index: number;
  /** 表示カラー */
  color: string;
  /** 表示文字 */
  text: string;
  /** 表示タイプ (start:予定開始日 / between:予定中間日 / end:予定終了日 / all:全日) */
  type: 'start' | 'between' | 'end' | 'all';
};
