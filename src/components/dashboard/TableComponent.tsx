"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { ResponseTypeHistory } from "@/Types";

const columns: ColumnDef<ResponseTypeHistory>[] = [
  {
    header: "Status",
    cell: ({ row }) => {
      const index = row.index + 1;
      return (
        <div className="capitalize"> {index.toString().padStart(2, "0")} </div>
      );
    },
  },
  {
    accessorKey: "isQR",
    header: "QR code ",
    cell: ({ row }) => {
      console.log(row.getValue("isQR"));
      return (
        <div
          className="font-medium"
          title={
            row.getValue("isQR") ? "This is a QR code" : "This is not a QR code"
          }
        >
          {row.getValue("isQR") ? "Yes" : "No"}
        </div>
      );
    },
  },
  {
    accessorKey: "ShortURL",
    header: "ShortUrl",
    cell: ({ row }) => (
      <Link
        target="_blank"
        className="capitalize text-blue-300"
        to={`${import.meta.env.VITE_FRONTEND_URL}/${row.getValue("ShortURL")} `}
      >
        Link
      </Link>
    ),
  },
  {
    accessorKey: "longURL",
    header: () => <div>Long Url </div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium" title={row.getValue("longURL")}>
          {row.getValue("longURL")}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className=""
        >
          Created At
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(new Date(row.getValue("createdAt")));
      return <div className="font-medium">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className=""
        >
          Visits
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const counts: { visits: number } = row.getValue("_count");
      return (
        <div className="text-center font-medium"> {counts?.visits || 0}</div>
      );
    },
  },
  {
    id: "actions",
    // enableHiding: false,
    cell: ({ row }) => {
      const ResponseType = row.original;
      const longURL = ResponseType?.longURL;
      const ShortURL = `${import.meta.env.VITE_FRONTEND_URL}/${
        ResponseType?.ShortURL
      }`;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 ">
              <span className="sr-only"> Open menu </span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuLabel>Actions </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(longURL)}
            >
              Copy LongURl
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(ShortURL)}
            >
              Copy Short Url
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const TableComponent = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    const fetchUserUrls = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance("v1/auth/user/fetch-urls");
        if (data.success) setData(data.data);
      } catch (error) {
        console.log(
          "error in fetchin the data of the user-created urls",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserUrls();
  }, []);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  if (isLoading) {
    return <div className="w-full">Loading.........</div>;
  }
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-[#393d53] hover:text-[#e7e6f4]"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-[#393d53] hover:text-[#e7e6f4]"
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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
