import { Button } from "../ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { Field, FieldGroup, FieldLabel } from "../ui/field";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useEffect, useLayoutEffect, useState } from "react";
import { CheckCircle, ChevronDownIcon } from "lucide-react";
import { ComboboxPopup } from "../common/ComboboxPopup";
import classService from "@/services/classService";
import attendanceService from "@/services/attendanceService";
import { Item } from "../ui/item";
import { Checkbox } from "../ui/checkbox";
import enrollmentService from "@/services/enrollmentService";
import { toast } from "sonner";

const dateSeparator = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return { year, month, day };
};

const AttendancePage = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [classSelected, setClassSelected] = useState({
    _id: null,
    label: "Chọn lớp",
  });
  const [date, setDate] = useState(new Date());
  const format = (date) => {
    const _date = new Date(date);
    return `${_date.getFullYear()}/${_date.getMonth() + 1}/${_date.getDate()}`;
  };

  const [present, setPresent] = useState(new Set([]));

  //Lấy danh sách class
  useEffect(() => {
    (async () => {
      try {
        const { data } = await classService.getClasses();
        const result = data.map((item) => {
          const { _id, className } = item;
          return { _id, label: className };
        });
        setClasses(result);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  //Lấy danh sách học sinh trong lớp
  useEffect(() => {
    (async () => {
      console.log(classSelected);
      if (!classSelected?._id) return;
      const result = await enrollmentService.getEnrollmentByClass(
        classSelected._id,
      );
      setStudents(result.data.enrollments);
    })();
  }, [classSelected]);

  //Lấy danh sách có mặt
  useEffect(() => {
    (async () => {
      if (!classSelected._id) return;
      const { year, month, day } = dateSeparator(date);
      const result = await attendanceService.getPresentStudents(
        classSelected._id,
        day,
        month,
        year,
      );

      setPresent(new Set([...result.data.present]));
    })();
  }, [classSelected, date]);

  //logic check và uncheck có mặt
  const handleCheckedChange = (studentId, e) => {
    setPresent((prev) => {
      if (e) {
        prev.add(studentId);
      } else {
        prev.delete(studentId);
      }
      return new Set(prev);
    });
  };

  //logic luu diem danh
  const handleSaveAttendance = async () => {
    try {
      const { day, month, year } = dateSeparator(date);
      const dateString = `${year}-${month}-${day}`;
      const result = await attendanceService.updateAttendance(
        classSelected?._id,
        [...present], //chuyển set về array để gửi lên server
        dateString,
      );
      console.log(result);
      toast.success("Đã lưu điểm danh");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <h1>Theo dõi điểm danh hàng ngày</h1>
      </div>
      <div className="flex items-start gap-4">
        <FieldGroup className="border min-w-[200px] max-w-[300px] p-4 rounded-2xl">
          <Field>
            <FieldLabel>Lớp</FieldLabel>
            <ComboboxPopup
              value={classSelected}
              data={classes}
              keyField="_id"
              onValueChange={(e) => {
                setClassSelected(e);
              }}
            />
          </Field>

          <Field className="">
            <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant={"outline"}
                    data-empty={!date}
                    className=" justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <ChevronDownIcon data-icon="inline-end" />
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  defaultMonth={date}
                />
              </PopoverContent>
            </Popover>
          </Field>
        </FieldGroup>
        <div className="w-full grow p-4 border rounded-2xl">
          <div className="flex gap-1 justify-end mb-4">
            <Button variant="outline">Có mặt tất cả</Button>
            <Button onClick={handleSaveAttendance}>Lưu điểm danh</Button>
          </div>
          <div className="grid gap-2">
            {students.map((item) => (
              <Item key={item.studentId} variant="outline">
                <Checkbox
                  onCheckedChange={(e) => {
                    handleCheckedChange(item.studentId, e);
                  }}
                  checked={present.has(item.studentId)}
                />
                {item.studentName}
              </Item>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
