import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/helper/currencyFormater";

// Calendar with attendance + weekdays
const MiniCalendar = ({ attendedDays = [], month = 4, year = 2026 }) => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div className="flex-1">
      {/* Month / Year */}
      <div className="flex items-center justify-center mb-2 text-lg font-semibold">
        Tháng {month} / {year}
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-2 text-lg text-muted-foreground">
        {weekDays.map((d) => (
          <div key={d} className="flex items-center justify-center h-10">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2 text-base">
        {days.map((day) => {
          const isAttended = attendedDays.includes(day);

          return (
            <div
              key={day}
              className="h-14 w-10 grid grid-rows-[1fr_auto] items-center justify-items-center py-1 rounded-lg bg-transparent hover:bg-white/20 transition"
            >
              <span>{day}</span>

              <span
                className={`w-2 h-2 rounded-full bg-green-500 ${isAttended ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Status Chip
const StatusChip = ({ status = "unpaid" }) => {
  const isUnpaid = status === "unpaid";

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
        ${isUnpaid ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}
    >
      <AlertCircle className="w-4 h-4" />
      {isUnpaid ? "Chưa thanh toán" : "Đã thanh toán"}
    </div>
  );
};

const StudentCard = ({
  month,
  year,
  tuitionInfor = {studentName:"", dates:[], amount:0, status:"", className}
}) => {
  console.log(tuitionInfor)

  const {studentName, dates, amount, status, className} = tuitionInfor || {};
  return (
    <Card className="rounded-2xl shadow-xl p-6 max-w-5xl w-full relative overflow-hidden bg-gradient-to-br from-[#f9e3d8] to-[#f6d9cc]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,_#eaa58b_1px,_transparent_1px)] [background-size:12px_12px]"></div>
      <CardContent className="relative p-0 grid grid-cols-2 gap-6">
        {/* LEFT - Calendar */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white/70 backdrop-blur-md p-4 aspect-square flex flex-col">
            

            <MiniCalendar month={month} year={year} attendedDays={dates} />
          </div>
        </div>

        {/* RIGHT - Info */}
        <div className="flex flex-col justify-between">
          <div className="space-y-3">
            <StatusChip status={status} />
            <h2 className="text-4xl font-semibold leading-tight">
              {studentName}
            </h2>

            <p className="text-2xl text-muted-foreground">{className}</p>

            <div className="flex items-center gap-2 text-2xl">
              <CheckCircle className="w-4 h-4" />
              {dates?.length || 0} buổi học
            </div>

            <div className="text-4xl font-bold">{formatCurrency(amount)}</div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button size="xlg" className="flex-1 rounded-xl">Đóng</Button>
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
