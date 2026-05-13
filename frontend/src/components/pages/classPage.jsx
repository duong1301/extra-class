import PageTitle from "../common/PageTitle";
import ClassList from "../features/classFeatures/classList";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import ClassAddDialogForm from "../features/classFeatures/classAddDialogForm";
import { useEffect, useState } from "react";
import classService from "@/services/classService";
import AddStudentToClassDialog from "../features/classFeatures/classAddStudentToClassDialog";
import { Input } from "../ui/input";
import { BugReportForm } from "../common/test";
import CurrencyInput from "../common/CurencyInput";

const ClassPage = () => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalRecord, setTotalRecord] = useState();
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const fetchData = async () => {
    const res = await classService.getClassListPagination({
      pageSize,
      pageIndex,
      search,
    });
    const data = res.data;
    setClasses(data);
    setTotalRecord(res.total);
  };

  //lấy danh sách lớp học
  useEffect(() => {
    fetchData();
  }, [refresh, pageSize, pageIndex, search]);

  useEffect(() => {
    setPageIndex(1);
  }, [pageSize]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <PageTitle>Quản Lý Lớp Học</PageTitle>
        <Button
          onClick={() => {
            setIsAddFormOpen(true);
          }}
          size="xlg"
        >
          <Plus />
          Thêm lớp học
        </Button>
      </div>
      <div className="overflow-hidden border rounded-2xl">
        <div className="p-4">
          <Input
            placeholder="Tìm kiếm lớp học"
            value={search}
            onValueChange={(e) => {
              setSearch(e);
            }}
          />
        </div>
        <ClassList
          onDataUpdate={() => {
            handleRefresh();
          }}
          pagination={{
            pageIndex,
            pageSize,
            totalRecord,
            pageSizes: [5, 10, 15],
          }}
          data={classes}
          onPageSizeChange={(e) => {
            setPageSize(e);
          }}
          onPageIndexChange={(e) => {
            setPageIndex(e);
          }}
        />
      </div>
      {isAddFormOpen && (
        <ClassAddDialogForm
          onSubmitSuccess={() => {
            handleRefresh();
          }}
          open={isAddFormOpen}
          onOpenChange={() => {
            setIsAddFormOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ClassPage;
