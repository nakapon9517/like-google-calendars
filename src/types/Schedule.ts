export type Schedule = {
  id: string;
  /** 予定名 */
  text: string;
  /** 予定カラー */
  color: string;
  /** 予定開始日 */
  fromAt: Date;
  /** 予定終了日 */
  toAt: Date;
};
