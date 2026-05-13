import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Chip from "../ui/chip";
import { Dialog, DialogContent } from "../ui/dialog";
import StudentCard from "../tuitionModal/TuitionModal";
import { useEffect, useState } from "react";
import {
  DataTablePagination,
  DataTableTab,
  DataTableTabs,
} from "../common/DataTable";
import tuitionService from "@/services/tuitionService";
import classService from "@/services/classService";

import { ComboboxPopup } from "../common/ComboboxPopup";
import { toast } from "sonner";
import { formatCurrency } from "@/helper/currencyFormater";

const statusLabel = {
  paid:"Đã thanh toán",
  unpaid:"Chưa thanh toán"
}

const TuitionPage = () => {
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 1,
  });
  const [status, setStatus] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isShowTuitionModal, setIsShowTuitionModal] = useState(false);
  const [tuitionDetail, setTuitionDetail] = useState(null);
  const [total, setTotal] = useState();
  const [search, setSearch] = useState("");

  const [classSelected, setClassSelected] = useState(null);
  const [classes, setClasses] = useState([]);

  //Lấy danh sách lớp học
  useEffect(() => {
    (async () => {
      try {
        const response = await classService.getClasses();
        const classData = response.data;
        const formattedClasses = classData.map((cls) => ({
          _id: cls._id,
          label: cls.className,
        }));
        setClasses([{ _id: null, label: "Tất cả" }, ...formattedClasses]);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    })();
  }, []);
  const [tuitions, setTuitions] = useState([]);
    console.log(status);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { pageIndex, pageSize } = pagination;
        const response = await tuitionService.getTuitionFeesByPagingAndFilter(
          { pageIndex, pageSize },
          { month, year, classId: classSelected?._id, search, status },
        );
        setTuitions(response.data);
        setTotal(response.pagination.total);
      } catch (error) {
        console.error("Error fetching tuition data:", error);
      }
    };
    fetchData();
  }, [classSelected, month, year, refresh, search, total, pagination, status]);

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (month === 1) {
        setMonth(12);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else {
      if (month === 12) {
        setMonth(1);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    }
  };

  const setPageIndex=(v)=>{
    setPagination(prev=>{
      return {...prev, pageIndex:v }
    })
  }

  const handleStatusChange = (val)=>{
    setStatus(val);
    setPageIndex(1)
  }

  const handlePayment = async (tuitionId) => {
    console.log("Processing payment for tuition ID:", tuitionId);
    try {
      const response = await tuitionService.updateTuitionStatus(
        tuitionId,
        "paid",
      );
      toast.success("Cập nhật trạng thái học phí thành công!");
      setRefresh((prev) => !prev); // Trigger data refresh
      console.log("Tuition status updated:", response.data);
    } catch (error) {
      console.error("Error updating tuition status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái học phí!");
    }
  };

  return (
    <div>
      <div className="flex justify-between ">
        <h1 className="items-center text-2xl font-semibold">
          Thống kê học phí
        </h1>
        <div className="flex items-center gap-2 p-2 border rounded-2xl mb-4">
          <Button variant="ghost" onClick={() => handleMonthChange("prev")}>
            <ChevronLeft />
          </Button>
          <span>
            {month}/{year}
          </span>
          <Button variant="ghost" onClick={() => handleMonthChange("next")}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="border  rounded-2xl">
        <div className="mb-4 px-4">
          <DataTableTabs defaultValue="">
            <DataTableTab
              onClick={(v) => {
                handleStatusChange(v);
              }}
              value={""}
              count={3}
            >
              Tất cả
            </DataTableTab>
            <DataTableTab
              onClick={(v) => {
                handleStatusChange(v);
              }}
              value={"paid"}
              count={2}
            >
              Đã thanh toán
            </DataTableTab>
            <DataTableTab
              onClick={(v) => {
                handleStatusChange(v);
              }}
              value={"unpaid"}
              count={1}
            >
              Chưa thanh toán
            </DataTableTab>
          </DataTableTabs>
        </div>
        <div className="px-4"></div>
        <div className="flex gap-4 px-4">
          <ComboboxPopup
            value={classSelected}
            data={classes}
            onValueChange={(v) => setClassSelected(v)}
            keyField="_id"
          />
          <Input
            value={search}
            onValueChange={(e) => {
              setSearch(e);
              setPageIndex(1)
            }}
            placeholder="Search..."
          />
        </div>
        <div className="p-4 flex">
          {status!=="" && <div className="h-11 flex items-center gap-2 px-3 border border-dashed rounded-xl">
            <span>Trạng thái</span>
            <Chip withCancel onClick={()=>{handleStatusChange("")}} >{statusLabel[status]}</Chip>
          </div>}
          {classSelected?._id && <div className="h-11 flex items-center gap-2 px-3 border border-dashed rounded-xl">
            <span>Lớp</span>
            <Chip withCancel onClick={()=>{
              setClassSelected(classes[0])
              setPageIndex(1)
            }}>{classSelected.label}</Chip>
          </div>}
          
          {search!=="" && <div className="h-11 flex items-center gap-2 px-3 border border-dashed rounded-xl">
            <span>Từ khoá</span>
            <Chip withCancel onClick={()=>{setSearch(""); setPageIndex(1)}}>{search}</Chip>
          </div>}
        </div>
        <div className="px-4 grid gap-1">
          {tuitions?.map((tuition) => {
            return (
              <TuitionCard
                onPayment={() => {
                  handlePayment(tuition.tuitionFeeId);
                }}
                onShowDetail={() => {
                  setIsShowTuitionModal(true);
                  setTuitionDetail(tuition);
                }}
                key={tuition._id}
                tuitionInfo={tuition}
              />
            );
          })}
          <DataTablePagination
            pageSize={pagination.pageSize}
            pageIndex={pagination.pageIndex}
            totalRecord={total}
            onPageIndexChange={(v) => {
              setPagination((prev) => {
                return { ...prev, pageIndex: v };
              });
            }}
            onPageSizeChange={(v) => {
              setPagination((prev) => {
                return { ...prev, pageSize: v, pageIndex: 1 };
              });
            }}
            pageSizes={[1, 5, 10, 15]}
          />
        </div>
      </div>
      <Dialog
        open={isShowTuitionModal}
        onOpenChange={() => {
          setIsShowTuitionModal(false);
        }}
      >
        <DialogContent className="sm:max-w-3xl p-0">
          <StudentCard tuitionInfor={tuitionDetail} month={month} year={year} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TuitionPage;

const TuitionCard = ({
  tuitionInfo,
  onPayment = () => {},
  onShowDetail = () => {},
}) => {
  const { studentId, studentName, amount, dates, status } = tuitionInfo || {};
  return (
    <div className="flex items-center border p-4 rounded-2xl">
      <div className="w-12 h-12 rounded-xl bg-purple-900 text-white font-bold flex items-center justify-center"></div>
      <div className="ml-4">
        <p className="font-bold text-xl">{studentName}</p>
        <p className="font- text-gray-600">
          Tổng: {dates?.length || 0} Buổi học
        </p>
      </div>

      <div className="ml-auto">
        <div>
          <p className="text-right">Dự tính</p>
          <p className="text-purple-900 text-2xl font-extrabold">
            {formatCurrency(amount)}
          </p>
        </div>
      </div>
      <div className="ml-4 self-end">
        {status === "paid" ? (
          <Chip variant="success">Đã đóng</Chip>
        ) : (
          <Chip variant="destructive">Chưa đóng</Chip>
        )}
        <Button onClick={onPayment} className="">
          Đóng học phí
        </Button>
        <Button onClick={onShowDetail} className="bg-amber-500">
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
};
