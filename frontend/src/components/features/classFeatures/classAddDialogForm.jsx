import CurrencyInput from "@/components/common/CurencyInput";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { daysOfWeek } from "@/helper/dayOfWeek";
import classService from "@/services/classService";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { file, object, string } from "zod";

const _daysOfWeek = Object.values(daysOfWeek);
const formSchema = z.object({
  className: z
    .string()
    .trim()
    .min(2, "Tên lớp phải có ít nhất 2 ký tự")
    .max(25, "Tên lớp không quá 25 ký tự"),
  tuitionFee: z.number({
    required_error: "This field is required",
    invalid_type_error: "Must be a string",
  }),
});

const ClassAddDialogForm = ({ open, onOpenChange, onSubmitSuccess }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      className: "",
      tuitionFee: 0,
    },
  });

  const handleAddClass = async (data) => {
    console.log(data);

    const { className, tuitionFee } = data;
    try {
      setLoading(true);
      const data = await classService.createClass({ className, tuitionFee });
      toast.success("Tạo lớp học thành công", { position: "top-center" });
      console.log(data);
      setLoading(false);
      form.setFocus("className");
      form.reset();
      onSubmitSuccess();
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
      console.log(error.response);
      setLoading(false);
    }
  };

  console.log(">>>", form);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <h1 className="text-lg font-semibold">Thêm lớp học mới</h1>
        </DialogHeader>
        <form id="form-addClass" onSubmit={form.handleSubmit(handleAddClass)}>
          <Controller
            name="className"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFore="form-addClass-className">
                    Tên lớp học <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input {...field} id="form-addClass-className" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="tuitionFee"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field>
                  <FieldLabel htmlFor="form-addClass-tuition">
                    Học phí <span className="text-destructive">*</span>
                  </FieldLabel>
                  <CurrencyInput
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v.floatValue);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.setFocus("className");
              form.reset();
            }}
          >
            Reset
          </Button>

          <Button type="submit" form="form-addClass" disabled={loading}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassAddDialogForm;

const ScheduleField = ({ onValueChange = () => {} }) => {
  const [day, setDay] = useState(_daysOfWeek[0].value);
  const [startTime, setStartTime] = useState("08:00");
  const [duration, setDuration] = useState("120");

  useEffect(() => {
    onValueChange({ day, startTime, duration });
  }, [day, startTime, duration]);

  return (
    <FieldGroup>
      <div className="flex gap-2">
        <Field>
          <FieldLabel>Ngày</FieldLabel>
          <Combobox
            onValueChange={(e) => {
              setDay(e.value);
            }}
            items={_daysOfWeek}
            itemToStringValue={(day) => day.label}
          >
            <ComboboxInput placeholder="Chọn ngày" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(day) => (
                  <ComboboxItem key={day.code} value={day}>
                    {day.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>

        <Field>
          <FieldLabel>Giờ học</FieldLabel>
          <Input
            onValueChange={(e) => {
              setStartTime(e);
            }}
            type="time"
            id="time-picker-optional"
            // step="1"
            defaultValue="08:00"
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>
        <Field>
          <FieldLabel>Thời gian</FieldLabel>
          <Input
            value={duration}
            onValueChange={(e) => {
              setDuration(e);
            }}
            placeholder="90 phút"
            type="number"
          />
        </Field>
      </div>
    </FieldGroup>
  );
};
