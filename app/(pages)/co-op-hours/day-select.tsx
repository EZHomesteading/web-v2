"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

const data: Days[] = [
  {
    id: 0,
    day: "Monday",
  },
  {
    id: 1,
    day: "Tuesday",
  },
  {
    id: 2,
    day: "Wednesday",
  },
  {
    id: 3,
    day: "Thursday",
  },
  {
    id: 4,
    day: "Friday",
  },
  {
    id: 5,
    day: "Sunday",
  },
  {
    id: 6,
    day: "Sunday",
  },
];

export type Days = {
  id: number;
  day: string;
};

export const columns: ColumnDef<Days>[] = [
  {
    id: "select",

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "day",
    header: () => <div className="text-right">Day</div>,
    cell: ({ row }) => {
      const day = row.getValue("day") as string;
      return <div className="text-right font-medium">{day}</div>;
    },
  },
];

export function DaySelect() {
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div className="flex">
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
