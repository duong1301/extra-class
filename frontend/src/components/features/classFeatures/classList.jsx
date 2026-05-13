import DataTable, {
  DataTableActionMenu,
  DataTableActionMenuItem,
  DataTablePagination,
} from "@/components/common/DataTable";
import Icon from "@/components/common/icon";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helper/currencyFormater";
import { dateFormats, formatDate } from "@/helper/dateTimeHelper";
import classService from "@/services/classService";
import { ListCollapse, Pen, PenIcon, Plus, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const ClassList = ({
  data,
  pagination = {},
  onPageSizeChange = () => {},
  onPageIndexChange = () => {},
  onDataUpdate = () => {},
}) => {
  const navigate = useNavigate();

  const { pageIndex, pageSize, totalRecord, pageSizes } = pagination;

  //cấu trúc bảng dữ liệu
  const columns = useMemo(() => [
    {
      accessorKey: "className",
      header: "Tên lớp",
    },
    {
      header: "Số học sinh",
      accessorKey: "enrollmentCount",
    },
    {
      accessorKey: "tuitionFee",
      header: "Học phí",
      cell: ({ cell }) => {
        return <span>{formatCurrency(cell.getValue())}/buổi</span>;
      },
    },
    {
      header: "Ngày tạo",
      accessorKey: "createdAt",
      cell: ({ cell }) => {
        const date = new Date(cell.getValue());
        return <span>{formatDate(date, dateFormats.DDMMYYYY)}</span>;
      },
    },
    {
      header: "",
      accessorKey: "act",
      cell: (props) => {
        const data = props.row.original._id;
        return (
          <div className="ml-auto flex items-center gap-1 w-fit">
            <DataTableActionMenu>
              <DataTableActionMenuItem
                onClick={() => {
                  handleDetail(data);
                }}
              >
                <ListCollapse />
                <span>Xem chi tiết</span>
              </DataTableActionMenuItem>
              <Separator />
              <DataTableActionMenuItem
                onClick={() => {
                  handleDelete(data);
                }}
                className="text-palette-Alert-errorIconColor"
              >
                <Trash />
                <span>Xoá</span>
              </DataTableActionMenuItem>
            </DataTableActionMenu>
          </div>
        );
      },
    },
  ]);
  const handleDelete = async (classId) => {
    try {
      await classService.deleteClass(classId);
      toast.success("Xoá lớp thành công", { position: "top-center" });
      onDataUpdate();
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
      console.log(error);
    }
  };

  const handleDetail = (classId) => {
    navigate(`./${classId}`);
  };

  return (
    <>
      <DataTable
        checkbox
        onSelectedIdChange={() => {}}
        data={data}
        columns={columns}
      ></DataTable>
      <DataTablePagination
        onPageSizeChange={onPageSizeChange}
        onPageIndexChange={onPageIndexChange}
        pageIndex={pageIndex}
        pageSizes={pageSizes}
        pageSize={pageSize}
        totalRecord={totalRecord}
      />
    </>
  );
};

export default ClassList;
