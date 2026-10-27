import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  // Момент последней успешной загрузки данных.
  since: Date;
};

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since }: Props) {
  // Значение не используется — тик нужен только чтобы раз в секунду перерисоваться.
  const [, setTick] = useState(0);

  useEffect(() => {
    // Функциональное обновление не зависит от замыкания, а clearInterval
    // не даёт интервалам копиться при размонтировании.
    const timer = setInterval(() => setTick((tick) => tick + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Считаем от since на каждом рендере, поэтому новый since сразу сбрасывает счётчик.
  const seconds = Math.max(0, Math.floor((Date.now() - since.getTime()) / 1000));

  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: '#6b7280',
  },
});
