const UNITS = { present: 1, half: 0.5, absent: 0 };

/** Day wage = day units × daily rate + overtime hours × (rate/8 × 1.5). */
export function dayWage(rate, status = "absent", ot = 0) {
  const r = Math.max(0, Number(rate) || 0);
  const hrs = status === "absent" ? 0 : Math.max(0, Number(ot) || 0);
  return Math.round((UNITS[status] ?? 0) * r + hrs * (r / 8) * 1.5);
}

/** Totals per worker for dates starting with `month` ("YYYY-MM"). */
export function monthSummary(records, workers, month) {
  return workers.map((w) => {
    let days = 0, ot = 0, wage = 0;
    for (const [date, day] of Object.entries(records)) {
      if (!date.startsWith(month)) continue;
      const e = day[w.id];
      if (!e) continue;
      days += UNITS[e.s] ?? 0;
      ot += e.s === "absent" ? 0 : Number(e.ot) || 0;
      wage += dayWage(entryRate(e, w), e.s, e.ot);
    }
    return { id: w.id, days, ot, wage };
  });
}

/** The rate saved on the day's entry wins, so changing a worker's rate never rewrites past days. */
export const entryRate = (e, w) => (e && e.r != null ? e.r : w.rate);

/** Set a new daily rate from `date` on: updates the worker and that day's entry, keeps earlier days. */
export function setRate(workers, records, id, rate, date) {
  const r = Math.round(Number(rate) || 0);
  if (r <= 0) return { workers, records };
  const ws = workers.map((w) => (w.id === id ? { ...w, rate: r } : w));
  const day = records[date];
  const rs = day && day[id] ? { ...records, [date]: { ...day, [id]: { ...day[id], r } } } : records;
  return { workers: ws, records: rs };
}
