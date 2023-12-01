import React, { useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalendarItem } from '@/types/CalendarItem';
import { DateData } from 'react-native-calendars';
import { DayProps } from 'react-native-calendars/src/calendar/day';

const width = Dimensions.get('window').width;

/** 日付内の予定バーの高さ */
export const CELL_HEIGHT = 16;

const MAX_EVENTS = 5; // 1日に表示する最大予定数
const CELL_ITEM_PADDING = 2; // 予定間の余白
const CELL_RADIUS = 3; // 予定バーの

type Props = DayProps & {
  date?: DateData | undefined;
  eventItems: Map<string, CalendarItem[]>;
  cellMinHeight: number;
};

// TODO: 1日あたり5件など多くの予定がある場合は「more」などを表示させる必要あり
export const GoogleCalendarDayItem = (props: Props) => {
  const { date, eventItems: dayItems, children, state, cellMinHeight } = props;

  // 該当日付の予定を表示順(インデックス)に並び替える
  const events = useMemo(
    () => (dayItems.get((date as DateData).dateString) ?? []).sort((a, b) => b.index - a.index),
    [date, dayItems],
  );

  // 日付をクリック
  const onDayPress = useCallback(() => {
    console.info('on press day', date?.dateString);
  }, []);

  // 予定をクリック
  const onEventPress = useCallback((item: CalendarItem) => {
    console.info('on press event', item.text);
  }, []);

  // 予定表示
  const renderEvent = useCallback((v: CalendarItem, i: number) => {
    const borderLeft = v.type == 'start' || v.type == 'all' ? CELL_RADIUS : 0; // 表示タイプが予定開始日または全日の場合は、左枠線を曲げる
    const borderRight = v.type == 'end' || v.type == 'all' ? CELL_RADIUS : 0; // 表示タイプが予定終了日または全日の場合は、右枠線を曲げる
    return (
      <TouchableOpacity
        key={`${v.id} - ${i}`}
        style={[
          styles.event,
          {
            backgroundColor: v.color,
            top: v.index * (CELL_HEIGHT + CELL_ITEM_PADDING), // 並び順の位置で表示させる
            borderTopLeftRadius: borderLeft,
            borderBottomLeftRadius: borderLeft,
            borderTopRightRadius: borderRight,
            borderBottomRightRadius: borderRight,
          },
        ]}
        onPress={() => onEventPress(v)}
      >
        {v.type == 'start' || v.type == 'all' ? (
          <View style={styles.eventRow}>
            <Text style={styles.eventText} numberOfLines={1}>
              {v.text}
            </Text>
          </View>
        ) : (
          <></>
        )}
      </TouchableOpacity>
    );
  }, []);

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        {
          minHeight: cellMinHeight,
          maxWidth: MAX_EVENTS * CELL_HEIGHT + CELL_ITEM_PADDING,
          opacity: state == 'disabled' ? 0.4 : 1, // 表示月以外の日付は薄く表示
        },
      ]}
      onPress={() => onDayPress()}
    >
      {/* chilerenに予定日が含まれているので表示 */}
      <Text style={[styles.dayText, state == 'today' && styles.todayText]}>{children}</Text>
      {/* 以下で該当日の予定を表示 */}
      <View>{events.map((event, i) => renderEvent(event, i))}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: '100%',
  },
  dayText: {
    textAlign: 'center',
    marginBottom: CELL_ITEM_PADDING,
  },
  todayText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  event: {
    width: '99%',
    height: CELL_HEIGHT,
    borderRadius: CELL_RADIUS,
    position: 'absolute',
    left: 0,
    zIndex: 2,
    justifyContent: 'center',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    paddingLeft: 2,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
});
