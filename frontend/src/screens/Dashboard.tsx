import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortDirection,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUp, ArrowDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Eye,
  Trash2,
  Pause,
  ScrollText,
  FileVideo,
  Play,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SocialMediaUser } from "@/types/app-types"
import { sample_data } from "@/data/sample-user-data"
import { isValidDate, getShortRelativeTime, getLiveURL } from "@/lib/utils"
import RecordingTimer from "@/components/recording-timer"
import AddStreamer from "./AddStreamer"
import {BrowserOpenURL} from "../../wailsjs/runtime";

function columnSortArrowIcon(sorted: false | SortDirection): React.ReactNode {
  if (!sorted) return <></>
  return sorted === "asc" 
    ? <ArrowUp className="-ml-2 -mr-1"/> 
    : <ArrowDown className="-ml-2 -mr-1"/>
}

/*
 ██████  ██████  ██      ██    ██ ███    ███ ███    ██ ███████
██      ██    ██ ██      ██    ██ ████  ████ ████   ██ ██
██      ██    ██ ██      ██    ██ ██ ████ ██ ██ ██  ██ ███████
██      ██    ██ ██      ██    ██ ██  ██  ██ ██  ██ ██      ██
 ██████  ██████  ███████  ██████  ██      ██ ██   ████ ███████


*/

export const columns: ColumnDef<SocialMediaUser>[] = [
  {
    accessorKey: "platform",
    header: ({ column }) => {
      return (
        <Button
          className="!px-1 !ml-1"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Platform
          {columnSortArrowIcon(column.getIsSorted())}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>{row.getValue("platform")}</div>
    ),
  },
  {
    accessorKey: "username",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          className="!px-1 !ml-1"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Streamer
          {columnSortArrowIcon(column.getIsSorted())}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className={row.original.botStatus === "paused" ? "opacity-40" : ""}>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{
            ((s: string) => s ? s.slice(0, 2).toUpperCase() : '')(row.getValue("username"))}
          </AvatarFallback>
        </Avatar>
        <p
          className={`max-w-40 overflow-hidden text-ellipsis ${
            row.original.botStatus === "paused" ? "text-muted-foreground" : ""
          }`}
        >
            {row.original.liveStatus === "live" ? (
            <Tooltip>
              <TooltipTrigger asChild>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault()
                  BrowserOpenURL(getLiveURL(row.original.platform, row.getValue("username")))
                }}
                className="underline text-primary hover:text-primary/80"
              >
                {row.getValue("username")}
              </a>
              </TooltipTrigger>
              <TooltipContent>
              Open in browser
              </TooltipContent>
            </Tooltip>
            ) : (
              row.getValue("username")
            )}
        </p>
        {row.original.liveStatus === "live" && (
          <div className="flex justify-start">
            <Badge variant="destructive">Live</Badge>
          </div>
        )}
      </div>
    )
  },
  {
    accessorKey: "botStatus",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          className="!px-1 !ml-1"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          {columnSortArrowIcon(column.getIsSorted())}
        </Button>
      )
    },
    cell: ({ row }) => (
      row.getValue("botStatus") === "recording" ?
        <div>
          {"Recording "}
          <div className="inline-flex w-15">
            <Badge variant="outline">
              <div className="inline-block italic text-muted-foreground">
                <RecordingTimer startTimeISO={row.original.lastLive} />
              </div>
            </Badge>
          </div>
        </div>
        :
        <div className={`capitalize ${row.getValue("botStatus") === "paused" ? "text-muted-foreground" : ""}`}>
          {row.getValue("botStatus")}
        </div>
    ),
  },
  {
    accessorKey: "lastLive",
    cell: ({ row }) => (
      row.original.liveStatus === "live" ? "" : (
        isValidDate(row.getValue("lastLive")) ?
          getShortRelativeTime(row.getValue("lastLive")) : ""
      )
    ),
    header: ({ column }) => {
      return (
        <Button
          className="!px-1 !ml-1"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Live
          {columnSortArrowIcon(column.getIsSorted())}
        </Button>
      )
    },
  },
  {
    accessorKey: "vods",
    header: ({ column }) => {
      return (
        <Button
          className="!px-1 !ml-1"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          VODs
          {columnSortArrowIcon(column.getIsSorted())}
        </Button>
      )
    },
    cell: ({ row }) => (
      row.getValue("vods") === 0 ? 
        <div className="text-muted-foreground">None</div>
        :
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="h-8 w-8">
              {row.getValue("vods")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Show VODs
          </TooltipContent>
        </Tooltip>
    ),
  },
  {
    accessorKey: "autoRecord",
    header: ({ column }) => {
      return (
        <Button
          className="!px-1 !ml-1"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Auto Rec
          {columnSortArrowIcon(column.getIsSorted())}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="w-15">
        <div className="flex justify-center">
          <Switch
            disabled={row.getValue("botStatus") === "paused"}
            checked={
              row.getValue("botStatus") === "paused" ? false 
              : row.getValue("autoRecord")
            }
            onCheckedChange={checked => {console.log(checked)}}
          />
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end !-ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-10 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {row.original.liveStatus === "live" && 
                <DropdownMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Eye /><span>Watch stream</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Open live stream in video player
                    </TooltipContent>
                  </Tooltip>
                </DropdownMenuItem>
              }
              <DropdownMenuItem>
                <FileVideo/><span>Show VODs</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                < ScrollText/><span>Show logs</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                {row.original.botStatus === "paused" ? (
                    <>< Play/><span>Resume</span></>
                ) : (
                    <>< Pause/><span>Pause</span></>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Trash2/><span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
/*
 ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
 ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██
*/


function Dashboard() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      platform: false, // Hide platform column by default
    })

  const table = useReactTable<SocialMediaUser>({
    data: sample_data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 8,
      },
    },
  })

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  function readableUserProp(columnId: string) : string {
    switch(columnId) {
      case 'vods': return 'VODs';
      case 'lastLive': return 'Last Live';
      case 'autoRecord': return 'Auto Rec';
      default: return columnId;
    }
  }

/*
 ██████  ██████  ███    ██ ████████ ██████   ██████  ██      ███████
██      ██    ██ ████   ██    ██    ██   ██ ██    ██ ██      ██
██      ██    ██ ██ ██  ██    ██    ██████  ██    ██ ██      ███████
██      ██    ██ ██  ██ ██    ██    ██   ██ ██    ██ ██           ██
 ██████  ██████  ██   ████    ██    ██   ██  ██████  ███████ ███████
*/

  return (
    <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter users"
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-50"
        />
        <div className="flex items-center space-x-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
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
                      {readableUserProp(column.id)}
                      </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Actions <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="ml-auto">
                < Pause/><span>Pause All</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="ml-auto">
                < Play/><span>Resume All</span>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" className="ml-auto">
                < Trash2/><span>Remove All</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AddStreamer />
        </div>
      </div>
{/*
████████  █████  ██████  ██      ███████
   ██    ██   ██ ██   ██ ██      ██
   ██    ███████ ██████  ██      █████
   ██    ██   ██ ██   ██ ██      ██
   ██    ██   ██ ██████  ███████ ███████
*/}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="!px-0">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
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
{/*
██████   █████   ██████  ███████ ███████
██   ██ ██   ██ ██       ██      ██
██████  ███████ ██   ███ █████   ███████
██      ██   ██ ██    ██ ██           ██
██      ██   ██  ██████  ███████ ███████
*/}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
            {currentPage} / {totalPages}
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
  )
}

export default Dashboard
