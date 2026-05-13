import {
  Book,
  BookOpen,
  Calendar,
  CircleDollarSign,
  Pen,
  Plus,
  Search,
} from "lucide-react";
import { useParams } from "react-router";
import { Separator } from "../ui/separator";
import DataTable from "../common/DataTable";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../ui/item";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import Icon from "../common/icon";
import { use, useEffect, useMemo, useState } from "react";
import axios from "axios";
import enrollmentService from "@/services/enrollmentService";
import classService from "@/services/classService";
import AddStudentToClassDialog from "../features/classFeatures/classAddStudentToClassDialog";
import { toast } from "sonner";

const data = [
  { id: 1, name: "Nguyen Van Nam", contact: "0123456789" },
  { id: 2, name: "Nguyen Van Dung", contact: "0123456789" },
  { id: 3, name: "Nguyen Van Binh", contact: "0123456789" },
];

const schedule = [
  {
    dayOfWeek: "mon",
    startTime: [8, 30],
    duration: 120,
  },
  {
    dayOfWeek: "tue",
    startTime: [8, 30],
    duration: 120,
  },
  {
    dayOfWeek: "wed",
    startTime: [8, 30],
    duration: 120,
  },
];

const ClassPageDetail = () => {
  const [refresh, setRefresh] = useState(false);
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [isTuitionEdit, setIsTuitionEdit] = useState(false);

  const { classId } = useParams();

  const [enrollments, setEnrollments] = useState([]);
  const [classInfo, setClassInfo] = useState({});

  const [nameEdit, setNameEdit] = useState("");
  const [tuitionEdit, setTuitionEdit] = useState("");

  const [isShowAddStudentDialog, setIsShowAddStudentDialog] = useState(false);


  const columns = useMemo(() => [
    { header: "Tên học sinh", accessorKey: "studentName" },
    { header: "Liên hệ", accessorKey: "contact" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="outline" size="sm">
          Xoá khỏi lớp
        </Button>
      ),
    },
  ]);

  //lấy thông tin lớp 
  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const response = await classService.getClassById(classId);
        const data = response.data;
        setClassInfo(data);
      } catch (error) {
        console.log("Error fetching class infor:", error);
      }
    };
    fetchClassInfo();
  }, [refresh]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await enrollmentService.getEnrollmentByClass(classId);
        const data = response.data.enrollments;
        setEnrollments(data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      }
    };

    fetchEnrollments();
  }, [refresh]);

  const handleUpdate = async()=>{
    const payload ={}
    if(nameEdit) payload.className=nameEdit
    if(tuitionEdit) payload.tuitionEdit = tuitionEdit

    console.log(payload.keys)

    toast.success("Dữ liệu đã được thay đổi")

    const result = await classService.updateClass({classId, payload})
    console.log(result)
  }

  return (
    <>
    <Button onClick={handleUpdate}>Update</Button>
      <AddStudentToClassDialog isOpen={isShowAddStudentDialog} classId={classId} onClose={() => setIsShowAddStudentDialog(false)} />
      <div className=" gap-4 items-start">
        <div className="border flex p-2 rounded-2xl">
          <div className=" p-4 flex flex-1 justify-start items-center gap-2  ">
            <div className="flex rounded-full items-center justify-center w-11 h-11 border">
              <BookOpen />
            </div>
            <div>
              <h2>Tên Lớp</h2>
              {!isNameEdit && (
                <div>
                  <strong>{classInfo.className}</strong>
                  <Icon
                    onClick={(e) => {
                      setIsNameEdit(true);
                    }}
                  >
                    <Pen />
                  </Icon>
                </div>
              )}
              {isNameEdit && (
                <div className="flex gap-1 ">
                  <Input onValueChange = {(v)=>{setNameEdit(v)}} />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsNameEdit(false);
                    }}
                  >
                    Huỷ
                  </Button>
                  <Button variant="">Lưu</Button>
                </div>
              )}
            </div>
          </div>

          <Separator orientation="vertical" />

          <div className=" p-4 flex flex-1 justify-start items-center gap-2  ">
            <div className="flex rounded-full items-center justify-center w-11 h-11 border">
              <CircleDollarSign />
            </div>
            <div>
              <h2>Học phí</h2>
              {!isTuitionEdit && (
                <div>
                  <strong>{classInfo.tuitionFee}</strong>
                  <Icon
                    onClick={() => {
                      setIsTuitionEdit(true);
                    }}
                  >
                    <Pen />
                  </Icon>
                </div>
              )}

              {isTuitionEdit && (
                <div className="flex gap-1 ">
                  <Input />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsTuitionEdit(false);
                    }}
                  >
                    Huỷ
                  </Button>
                  <Button variant="">Lưu</Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-4 mt-4 ">
          <div className="min-w-[250px] w-[300px] border rounded-2xl p-2">
            <div className="flex justify-between py-2">
              <Calendar />
              <Button>
                <Plus /> Thêm buổi học
              </Button>
            </div>
            <div className="grid gap-2">
              <ScheduleItem data={schedule[0]} />
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Thứ 2</ItemTitle>
                  <ItemDescription>08.00 - 10.00</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline">Xoá</Button>
                  <Button variant="outline">Sửa</Button>
                </ItemActions>
              </Item>

              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Thứ 2</ItemTitle>
                  <ItemDescription>08.00 - 10.00</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline">Xoá</Button>
                  <Button variant="outline">Sửa</Button>
                </ItemActions>
              </Item>
            </div>
          </div>
          <div className="flex-1 border rounded-2xl overflow-hidden">
            <div className="flex gap-2 p-2">
              <InputGroup>
                <InputGroupInput placeholder="Tìm kiếm" />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
              <Button onClick={() => setIsShowAddStudentDialog(true)}>
                <Plus /> Thêm học sinh
              </Button>
            </div>
            <DataTable
              keyData="studentId"
              checkbox
              data={enrollments}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassPageDetail;

const ScheduleItem = ({ data }) => {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{data.dayOfWeek}</ItemTitle>
        <ItemDescription>
          {data.startTime[0]}.{data.startTime[1]} -{" "}
          {data.startTime[0] + data.duration / 60}.
          {(data.startTime[1] + data.duration) % 60}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline">Xoá</Button>
        <Button variant="outline">Sửa</Button>
      </ItemActions>
    </Item>
  );
};
