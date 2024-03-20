export type Status = {
  value: string;
  label: string;
  dbValue: string;
};

export const statuses: Status[] = [];

for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const paddedHour = hour.toString().padStart(2, "0");
    const paddedMinute = minute.toString().padStart(2, "0");

    const label = `${hour % 12 || 12}:${paddedMinute} ${
      hour < 12 ? "AM" : "PM"
    }`;
    const value = `${label}`;
    const dbValue = `${paddedHour}:${paddedMinute}`;

    statuses.push({ value, dbValue, label });
  }
}
