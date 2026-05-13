import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Field, FieldLabel } from "../ui/field";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Pen,
  Trash,
  UserX,
} from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Icon from "./icon";

const DataTable = ({
  data = [],
  columns = [],
  checkbox = false,
  keyData = "_id",
  onSelectedIdChange = () => {},
  onDeleteMultiple = () => {},
}) => {
  const [rowSelection, setRowSelection] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const dataMap = useMemo(() => {
    return new Map(data.map((item) => [item[keyData], item]));
  }, [data]);

  useEffect(() => {
    onSelectedIdChange(selectedIds);
  }, [selectedIds]);

  const getPageCheckAllState = () => {
    const keys = new Set(dataMap.keys());
    const intersection = keys.intersection(selectedIds);
    if (intersection.size > 0 && intersection.size === keys.size)
      return "checked";
    if (intersection.size > 0) return "indeterminate";
    return false;
  };

  const handlePageCheckAll = (e) => {
    if (e) {
      setSelectedIds((prev) => {
        const ids = dataMap.keys();
        return new Set([...prev, ...ids]);
      });
    } else {
      setSelectedIds((prev) => {
        const ids = dataMap.keys();
        const removeIdsSet = new Set(ids);
        const result = [...prev].filter((item) => !removeIdsSet.has(item));
        return new Set([...result]);
      });
    }
  };

  const handleSelectedIds = (id, isAdd) => {
    if (isAdd) {
      setSelectedIds((prev) => {
        prev.add(id);
        return new Set(prev);
      });
    } else {
      setSelectedIds((prev) => {
        prev.delete(id);
        return new Set(prev);
      });
    }
  };

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
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => {
          return (
            <TableRow
              className="bg-palette-grey-200 hover:bg-palette-grey-200 border-dashed"
              key={headerGroup.id}
            >
              {checkbox && (
                <TableHead>
                  <div
                    data-active={selectedIds?.size > 0}
                    className="transition-all flex justify-between items-center absolute top-0 left-0  px-4 h-10 w-0 data-active:w-full data-active:bg-palette-primary-lighter "
                  >
                    <div className="flex items-center">
                      <Checkbox
                        onCheckedChange={(e) => {
                          handlePageCheckAll(e);
                        }}
                        indeterminate={
                          getPageCheckAllState() === "indeterminate"
                        }
                        checked={getPageCheckAllState() === "checked"}
                      />
                      {selectedIds.size > 0 && (
                        <span className="ml-4 text-palette-primary-main">
                          {selectedIds.size} Đã chọn
                        </span>
                      )}
                    </div>

                    {selectedIds.size > 0 && (
                      <div
                        onClick={onDeleteMultiple}
                        className="w-8 h-8 hover:bg-palette-primary-main/10 cursor-pointer flex items-center justify-center rounded-full"
                      >
                        <Trash
                          className="text-palette-primary-main  "
                          size={18}
                        />
                      </div>
                    )}
                  </div>
                </TableHead>
              )}
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className={"px-4"} key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          );
        })}
      </TableHeader>
      <TableBody className={"border-dashed border-b"}>
        {table.getRowModel().rows.map((row) => {
          return (
            <TableRow className={"border-dashed"} key={row.id}>
              {checkbox && (
                <TableCell className={"p-4"}>
                  <Checkbox
                    checked={selectedIds.has(row.original[keyData])}
                    onCheckedChange={(e) => {
                      handleSelectedIds(row.original[keyData], e);
                    }}
                  />
                </TableCell>
              )}
              {row.getAllCells().map((cell) => {
                return (
                  <TableCell className={"p-4"} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default DataTable;

export const DataTableFilterContainer = ({ children, label }) => {
  return (
    <div className="flex flex-wrap w-fit gap-1 items-center rounded-md p-2 border border-dashed ">
      {label && <span className="font-semibold">{label} </span>}
      {children}
    </div>
  );
};

const DataTableTabsContext = createContext();
export const DataTableTabs = ({ defaultValue = "all", children }) => {
  const [selected, setSelected] = useState(defaultValue);
  const [offsetWidth, setOffsetWidth] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const handleOffset = (e) => {
    const element = e;
    const { offsetLeft, offsetWidth } = element;
    setOffsetLeft(offsetLeft);
    setOffsetWidth(offsetWidth);
  };

  const style = { width: offsetWidth, left: offsetLeft };

  const value = useMemo(() => ({ handleOffset, selected, setSelected }));

  return (
    <div className=" ">
      <DataTableTabsContext.Provider value={value}>
        <div className="flex gap-4 relative">{children}</div>
      </DataTableTabsContext.Provider>
      <div className="relative bg-gray-100">
        <div
          style={style}
          className="transition-all top-0 relative bg-gray-700 h-0.5"
        ></div>
      </div>
    </div>
  );
};

export const DataTableTab = ({
  children,
  onClick = () => {},
  value,
  count = 0,
}) => {
  const ref = useRef(null);
  const data = useContext(DataTableTabsContext);
  const { handleOffset, selected, setSelected } = data;
  const active = value === selected;

  useEffect(() => {
    const element = ref.current;
    const { offsetLeft, offsetWidth } = element;
    if (selected === value) {
      handleOffset(element);
    }
  }, [ref]);

  return (
    <div
      ref={ref}
      data-active={active}
      onClick={(e) => {
        (handleOffset(ref.current), setSelected(value), onClick(value));
      }}
      className={cn(
        "relative font-semibold text-gray-600 data-active:text-gray-900 flex items-center gap-2 text-xl cursor-pointer py-4",
      )}
    >
      {children}
      <span
        onClick={() => {
          handleOffset(ref.current);
        }}
        data-active={active}
        className="px-3 text-white rounded-md py-1 bg-gray-700  data-active:bg-gray-900"
      >
        {count}
      </span>
    </div>
  );
};

export const DataTablePagination = ({
  onPageSizeChange = () => {},
  onPageIndexChange = () => {},
  pageSize = 0,
  pageSizes = [],
  pageIndex = 1,
  totalRecord = 0,
}) => {
  const maxPage = Math.max(1, Math.ceil(totalRecord / pageSize));

  const [pSize, setPSize] = useState(pageSize);
  const [pIndex, setPIndex] = useState(pageIndex);
  useEffect(() => {
    onPageSizeChange(pSize);
  }, [pSize]);
  useEffect(() => {
    onPageIndexChange(pIndex);
  }, [pIndex]);

  useEffect(()=>{
    setPSize(pageSize)
  },[pageSize])
  useEffect(()=>{
    setPIndex(pageIndex)
  },[pageIndex])

  const handlePageIndex = (currentIndex, action) => {
    if (action === "next") {
      if (currentIndex < maxPage) {
        const next = currentIndex + 1;
        setPIndex(next);
      }
    } else {
      if (currentIndex > 1) {
        const prev = currentIndex - 1;
        setPIndex(prev);
      }
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 p-4">
      <Field className={"w-fit"} orientation="horizontal">
        <FieldLabel htmlFor="select-row-per-page">
          Số bản ghi mỗi trang
        </FieldLabel>
        <Select
          value={pageSize}
          onValueChange={(v) => {
            setPSize(v);
          }}
        >
          <SelectTrigger id="select-row-per-page" className={"w-20"}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {pageSizes.map((ps) => {
                return (
                  <SelectItem key={ps} value={ps}>
                    {ps}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <div className="flex items-center gap-1">
        <span>
          {totalRecord === 0
            ? 0
            : pSize * (Math.min(maxPage, pageIndex) - 1) + 1}
        </span>
        <span>-</span>
        <span>
          {Math.min(
            pSize * (Math.min(maxPage, pageIndex) - 1) + pSize,
            totalRecord,
          )}
        </span>
        <span>/</span>
        <span>{totalRecord}</span>
      </div>

      <Pagination className={"mx-0 w-auto"}>
        <PaginationContent>
          <PaginationItem
            onClick={() => {
              handlePageIndex(pIndex, "prev");
            }}
          >
            <ChevronLeft />
          </PaginationItem>
          <PaginationItem
            onClick={() => {
              handlePageIndex(pIndex, "next");
            }}
          >
            <ChevronRight />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export const DataTableActionMenu = ({ children }) => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Icon>
            <EllipsisVertical />
          </Icon>
        }
      />
      <PopoverContent
        align="end"
        className={cn(
          "w-fit p-1",
          " bg-no-repeat bg-cover bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfNDQ2NF81NTMzNykiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfNDQ2NF81NTMzNyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K'),url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfNDQ2NF81NTMzOCkiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfNDQ2NF81NTMzOCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==')]",
        )}
      >
        <div className={cn("min-w-30 flex flex-col gap-1")}>{children}</div>
      </PopoverContent>
    </Popover>
  );
};

export const DataTableActionMenuItem = ({ children, onClick, className }) => {
  return (
    <div
      className={cn(
        "hover:bg-palette-action-hover select-none flex          items-center gap-4 p-2  rounded-md hover:cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
