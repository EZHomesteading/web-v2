"use client";
import {
  ColumnDef,
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
import { useEffect, useState } from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const data: Days[] = [
  { id: 0, day: "Monday" },
  { id: 1, day: "Tuesday" },
  { id: 2, day: "Wednesday" },
  { id: 3, day: "Thursday" },
  { id: 4, day: "Friday" },
  { id: 5, day: "Saturday" },
  { id: 6, day: "Sunday" },
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

interface DaySelectProps {
  handleSpecificDays: (selectedDays: number[]) => void;
  handleApplyToAll: () => void;
  currentDayIndex: number;
}

export function DaySelect({
  handleSpecificDays,
  handleApplyToAll,
  currentDayIndex,
}: DaySelectProps) {
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
  });
  const [allDaysSelected, setAllDaysSelected] = useState(false);

  const handleEveryDayChange = (checked: boolean) => {
    setAllDaysSelected(checked);
    if (checked) {
      const allDaysSelected = data.reduce((acc, row) => {
        acc[row.id] = true;
        return acc;
      }, {} as Record<number, boolean>);
      setRowSelection(allDaysSelected);
      handleApplyToAll();
    } else {
      setRowSelection({});
    }
  };

  const handleRowSelection = (checked: boolean, rowId: number) => {
    setRowSelection((prevRowSelection) => ({
      ...prevRowSelection,
      [rowId]: checked,
    }));
  };

  const handleSpecificDaysUpdate = () => {
    const selectedDays = Object.keys(rowSelection)
      .filter((key) => rowSelection[Number(key)])
      .map(Number);
    handleSpecificDays(selectedDays);
  };

  useEffect(() => {
    handleSpecificDaysUpdate();
  }, [rowSelection]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center p-2 gap-2">
        <Checkbox
          checked={allDaysSelected}
          onCheckedChange={handleEveryDayChange}
          aria-label="Select all days"
        />
        <h1 className={`${outfit.className} font-semibold`}>
          Apply to Everyday
        </h1>
      </div>
      <div className="rounded-md border bg shadow-lg">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${outfit.className} font-extralight`}
                    >
                      {cell.column.id === "select" ? (
                        <Checkbox
                          checked={
                            row.getIsSelected() ||
                            row.original.id === currentDayIndex
                          }
                          onCheckedChange={(value) =>
                            handleRowSelection(!!value, row.original.id)
                          }
                          aria-label="Select row"
                        />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
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
