import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import enrollmentService from "@/services/enrollmentService";
import studentService from "@/services/studentService";
import { Search } from "lucide-react";
import { use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const AddStudentToClassDialog = ({ classId, isOpen, onClose }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await studentService.getUnClassifiedStudents();
      setStudents(response.data);
    };
    fetchStudents();
  }, []);

  const handleAddStudent = (studentId) => {
    setSelectedStudentIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(studentId);
      return newSet;
    });
  };

  const handleEnrollStudents = async () => {
    try {
      const response = await enrollmentService.enrollStudentsToClass(
        Array.from(selectedStudentIds),
        classId,
      );
      toast.success("Học sinh đã được thêm vào lớp thành công!");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { header: "Tên học sinh", accessorKey: "studentName" },
    {
      id: "action",
      cell: ({ row }) => {
        const studentId = row.original._id;

        return selectedStudentIds.has(studentId) ? (
          <Button variant="outline" disabled>
            Đã chọn
          </Button>
        ) : (
          <Button
            onClick={() => {
              handleAddStudent(studentId);
            }}
            variant="outline"
          >
            Chọn
          </Button>
        );
      },
    },
  ];

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm học sinh vào lớp</DialogTitle>
          <DialogDescription>
            Danh sách học sinh chưa phân lớp
          </DialogDescription>
        </DialogHeader>
        <InputGroup>
          <InputGroupInput />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <DataTable columns={columns} data={students} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button onClick={handleEnrollStudents}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentToClassDialog;
