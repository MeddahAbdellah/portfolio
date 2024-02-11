"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import type { Deployment } from "./deployments.model";

function useAsyncReducer<T, Error = unknown, Action = string>(
  reducer: (state: T | undefined, action: Action) => Promise<T>,
  initState: T,
): [T, boolean, Error | undefined, (action: Action) => Promise<void>] {
  const [state, setState] = useState<T>(initState);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const dispatch = async (action: Action) => {
    setPending(true);
    try {
      const newState = await reducer(state, action);
      setState(newState);
    } catch (error) {
      setError(error as Error);
    }
    setPending(false);
  };

  return [state, pending, error, dispatch];
}

async function toDeployments(): Promise<Deployment[]> {
  try {
    const response = await fetch(`api/deployments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { deployments } = await response.json();
    return deployments;
  } catch (error) {
    throw "Unable to fetch deployments.";
  }
}

export function DataTable(): JSX.Element {
  const [deployments, pending, error, dispatch] = useAsyncReducer<
    Deployment[],
    string,
    "[GET] deployments"
  >(toDeployments, []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable<Deployment>({
    data: deployments,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
    },
  });

  useEffect(() => {
    dispatch("[GET] deployments");
    table.setPageSize(5);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter references..."
          value={(table.getColumn("commit")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("commit")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />

        <Button
          variant="outline"
          className="ml-auto"
          onClick={() => dispatch("[GET] deployments")}
        >
          {pending ? (
            <Spinner />
          ) : (
            <i className="fa-solid fa-arrows-rotate"></i>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  {error ? error : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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
}
