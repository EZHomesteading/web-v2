"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/app/components/ui/table";

export type Days = {
  id: string;
  day: string;
  hours: {
    open: number;
    close: number;
  };
};

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMins = mins < 10 ? `0${mins}` : mins;
  return `${formattedHours}:${formattedMins} ${ampm}`;
};

export const columns: ColumnDef<Days>[] = [
  {
    accessorKey: "day",
    header: () => <div className="text-left">Day</div>,
    cell: ({ row }) => {
      const day = row.getValue("day") as string;
      return <div className="text-left font-medium">{day}</div>;
    },
  },
  {
    id: "hours",
    header: () => <div className="text-right">Open - Close</div>,
    cell: ({ row }) => {
      const hours = row.original.hours;
      return (
        <div className="text-right text-sm w-[140px]">
          {formatTime(hours.open)} - {formatTime(hours.close)}
        </div>
      );
    },
  },
];

interface HoursDisplayProps {
  coOpHours: {
    [key: number]: {
      open: number;
      close: number;
    };
  };
}

export function HoursDisplay({ coOpHours }: HoursDisplayProps) {
  const data: Days[] = React.useMemo(() => {
    return Object.entries(coOpHours).map(([key, value], index) => ({
      id: key,
      day: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ][index],
      hours: value,
    }));
  }, [coOpHours]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex">
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
