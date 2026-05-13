import StudentList from "../features/student/studentList";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import Chip from "../ui/chip";
import PageTitle from "../common/PageTitle";
import {
  DataTableFilterContainer,
  DataTablePagination,
} from "../common/DataTable";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import StudentAddForm from "../features/student/studentAddForm";
import studentService from "@/services/studentService";
import { ComboboxPopup } from "../common/ComboboxPopup";
import classService from "@/services/classService";

const StudentPage = () => {
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 1,
  });
  const [students, setStudents] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [isOpenAddForm, setIsOpenAddForm] = useState(false);
  const [isRefresh, setIsRefresh] = useState(0);
  const [classes, setClasses] = useState([]);
  const [classSelected, setClassSelected] = useState(null);
  const [search, setSearch] = useState("");
  const handleRefresh = () => {
    setIsRefresh(isRefresh + 1);
  };

  //Lấy danh sách lớp học
  useEffect(() => {
    (async () => {
      try {
        const { data } = await classService.getClasses();
        const result = data.map((item) => {
          const { _id, className } = item;
          return { _id, label: className };
        });

        setClasses([{ _id: null, label: "Tất cả" }, ...result]);
      } catch (error) {
        console.log(error.response.data);
      }
    })();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentService.getStudents(
        { pageSize: pagination.pageSize, pageIndex: pagination.pageIndex },
        { classId: classSelected?._id, search },
      );
      setStudents(res.data);
      setTotalRecord(res.total);
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [isRefresh, classSelected, search, pagination]);

  return (
    <>
      <div className="w-full h-[calc(100vh-24px)]">
        <div className="flex items-center justify-between mb-3">
          <PageTitle>Quản lý học sinh</PageTitle>
          <Button
            size="xlg"
            className={"hover:cursor-pointer"}
            onClick={() => setIsOpenAddForm(true)}
          >
            <Plus data-icon="inline-start" />
            Thêm Học Sinh
          </Button>
        </div>
        <div className="border overflow-auto rounded-2xl">
          <div className="flex gap-x-2 p-4 ">
            <Input
              value={search}
              onValueChange={(value) => {
                setPagination((prev) => {
                  return { ...prev, pageIndex: 1 };
                });
                setSearch(value);
              }}
              className="min-w-[200px]"
              type="text"
              placeholder="Tìm kiếm học sinh"
            />
            <ComboboxPopup
              value={classSelected}
              data={classes}
              keyField="_id"
              onValueChange={(e) => {
                setPagination((prev) => {
                  return { ...prev, pageIndex: 1 };
                });
                setClassSelected(e);
              }}
            />
          </div>
          <div className="p-4 ">
            <p className="">
              <strong>{totalRecord} </strong>Kết quả
            </p>
            <div className="flex flex-wrap gap-2">
              {classSelected?._id && (
                <DataTableFilterContainer label={"Lớp :"}>
                  <Chip
                    withCancel
                    onClick={() => {
                      setClassSelected(classes[0]);
                    }}
                  >
                    {classSelected.label}
                  </Chip>
                </DataTableFilterContainer>
              )}
              {search.trim().length > 0 && (
                <DataTableFilterContainer label={"Từ khoá: "}>
                  <Chip
                    withCancel
                    onClick={() => {
                      setSearch("");
                    }}
                  >
                    {search}
                  </Chip>
                </DataTableFilterContainer>
              )}
            </div>
          </div>
          <StudentList
            data={students}
            onRefresh={() => {
              handleRefresh();
            }}
          />
          <DataTablePagination
            onPageIndexChange={(v) => {
              setPagination((prev) => {
                return { ...prev, pageIndex: v };
              });
            }}
            onPageSizeChange={(v) => {
              setPagination((prev) => {
                return { ...prev, pageSize: v, pageIndex:1 };
              });
            }}
            pageSize={pagination.pageSize}
            pageIndex={pagination.pageIndex}
            totalRecord={totalRecord}
            pageSizes={[5, 8, 10]}
          />
        </div>
      </div>
      <StudentAddForm
        onSubmited={() => {
          handleRefresh();
        }}
        open={isOpenAddForm}
        onOpenChange={() => {
          setIsOpenAddForm(false);
        }}
      />
    </>
  );
};

export default StudentPage;
