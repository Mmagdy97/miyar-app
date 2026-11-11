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
      wage += dayWage(w.rate, e.s, e.ot);
    }
    return { id: w.id, days, ot, wage };
  });
}
