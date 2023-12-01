import { useMemo, useState } from 'react';
import { Schedule } from '@/types/Schedule';
import { CalendarItem } from '@/types/CalendarItem';
import dayjs from 'dayjs';
import { dateFormat } from '@/utils';

const COLORS = [
  '#A3D10C',
  '#8FBC8B',
  '#20B2AA',
  '#FFE944',
  '#FFD700',
  '#DEB887',
  '#FFA07A',
  '#FB7756',
  '#FF4D4D',
  '#FF99E6',
  '#CDA5F3',
  '#B0C4DE',
  '#87CEEB',
  '#9999FF',
  '#6B7DB3',
  '#778899',
  '#6F6D78',
];

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<Schedule[]>([
    { id: 'id-1', text: '予定A', color: COLORS[0], fromAt: new Date(2023, 11, 1), toAt: new Date(2023, 11, 1) },
    { id: 'id-2', text: '予定B', color: COLORS[1], fromAt: new Date(2023, 11, 3), toAt: new Date(2023, 11, 5) },
    { id: 'id-3', text: '予定C', color: COLORS[2], fromAt: new Date(2023, 11, 4), toAt: new Date(2023, 11, 8) },
    { id: 'id-4', text: '予定D', color: COLORS[3], fromAt: new Date(2023, 11, 21), toAt: new Date(2023, 11, 24) },
    { id: 'id-5', text: '予定E', color: COLORS[4], fromAt: new Date(2023, 11, 23), toAt: new Date(2023, 11, 23) },
    { id: 'id-6', text: '予定F', color: COLORS[5], fromAt: new Date(2023, 11, 23), toAt: new Date(2023, 11, 24) },
    { id: 'id-7', text: '予定G', color: COLORS[6], fromAt: new Date(2023, 11, 24), toAt: new Date(2023, 11, 24) },
    { id: 'id-8', text: '予定H', color: COLORS[7], fromAt: new Date(2023, 11, 29), toAt: new Date(2023, 11, 29) },
    { id: 'id-9', text: '予定I', color: COLORS[8], fromAt: new Date(2023, 11, 30), toAt: new Date(2023, 11, 31) },
    { id: 'id-10', text: '予定J', color: COLORS[9], fromAt: new Date(2023, 11, 31), toAt: new Date(2023, 11, 31) },
  ]);

  const eventItems = useMemo(() => {
    // ポイント1: 結果はMapにセットしていく
    const result = new Map<string, CalendarItem[]>();
    events.map((event, i) => {
      const dayKey = dateFormat(event.fromAt);
      const diff = dayjs(event.toAt).diff(event.fromAt, 'day') + 1;
      if (diff == 1) {
        // A:予定が1日以内の場合
        const currentData = result.get(dayKey);
        // A-1:既に既存データがある場合は下に表示させるため表示順を取得
        const maxIndex = currentData?.reduce((p, c) => Math.max(p, c.index), 0);
        result.set(dayKey, [
          ...(currentData ?? []),
          {
            id: event.id,
            index: maxIndex != undefined ? maxIndex + 1 : 0, // A-2:既にある予定の下に表示
            color: event.color,
            text: event.text,
            type: 'all',
          },
        ]);
      } else {
        // B:予定が1日以上の場合
        let index: null | number = null;
        // B-1:予定が複数日に跨る場合は該当分処理する
        Array(diff)
          .fill(null)
          .map((_, i) => {
            const date = dateFormat(dayjs(new Date(dayKey)).add(i, 'day').toDate()); // 例: 予定が 12/1 ~ 12/4 の場合、12/1, 12/2, 12/3, 12/4となる
            const currentData = result.get(date);
            if (index == null) index = currentData?.length ?? 0; // 既存の予定と被らないよう該当日付の予定数を取得しインデックスに指定
            result.set(date, [
              ...(currentData ?? []),
              {
                id: event.id,
                index,
                color: event.color,
                text: event.text,
                type: i == 0 ? 'start' : i == diff - 1 ? 'end' : 'between', // 表示タイプの指定 (start:予定開始日 / between:予定中間日 / end:予定終了日 / all:全日)
              },
            ]);
          });
      }
    });
    return result;
  }, []);

  return { eventItems };
};
