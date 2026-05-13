import DataTable, {
  DataTableActionMenu,
  DataTableActionMenuItem,
} from "@/components/common/DataTable";
import studentService from "@/services/studentService";
import { useMemo } from "react";
import { toast } from "sonner";

const StudentList = ({ data = [], onRefresh=()=>{} }) => {
  const handleDeleteStudent = async (id) => {
    try {
      const result = await studentService.deleteStudent(id);
      onRefresh()
      toast.success("Xoá thành công");
    } catch (error) {}
  };

  const columns = useMemo(() => [
    {
      accessorKey: "studentName",
      header: "Tên học sinh",
    },
    {
      accessorKey: "contact",
      header: "Liên hệ",
    },
    {
      id: "action",
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <DataTableActionMenu>
            <DataTableActionMenuItem
              onClick={() => {
                console.log(id);
              }}
            >
              Chỉnh sửa
            </DataTableActionMenuItem>
            <DataTableActionMenuItem
              onClick={() => {
                console.log(id);
              }}
            >
              Không sử dụng
            </DataTableActionMenuItem>
            <DataTableActionMenuItem
              onClick={() => {
                handleDeleteStudent(id);
              }}
            >
              Xoá
            </DataTableActionMenuItem>
          </DataTableActionMenu>
        );
      },
    },
  ]);
  return (
    <DataTable
      checkbox
      keyData="_id"
      pagination
      data={data}
      columns={columns}
    />
  );
};

export default StudentList;
