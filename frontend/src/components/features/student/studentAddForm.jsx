import { ComboboxPopup } from "@/components/common/ComboboxPopup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import classService from "@/services/classService";
import studentService from "@/services/studentService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  studentName: z
    .string()
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(30, "Tên không quá 30 ký tự"),
  contact: z.string().trim(),
  classId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Chọn một lớp học"),
});

const StudentAddForm = ({ open, onOpenChange, onSubmited }) => {
  const [classes, setClasses] = useState([]);
  const [classSelected, setClassSelected] = useState({ _id: "", label: "Chưa chọn lớp" });

  // lấy ds lớp
  useEffect(() => {
    (async () => {
      try {
        const { data } = await classService.getClasses();

        if(data.length<=0) return;

        const result = data.map((item) => {
          const { _id, className } = item;
          return { _id, label: className };
        });

        setClasses(result);
      } catch (error) {
        console.log(error.response.data);
      }
    })();
  }, []);


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      contact: "",
      classId: "",
    },
  });

  const handleSubmit = async (data) => {
    console.log(data);
    try {
      const { studentName, classId, contact } = data;
      const res = await studentService.createStudent({ studentName, classId });
      toast.success("Thêm học sinh thành công");
      const current = form.getValues();

      form.reset({
        ...current,
        studentName:"",
        contact:""
      });
      // setClassSelected(classes[0]);
      onSubmited()
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm học sinh mới</DialogTitle>
        </DialogHeader>
        <form id="form-addStudent" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldSet className={"border p-2 rounded-sm"}>
            <FieldLegend>Thông tin học sinh</FieldLegend>
            <FieldGroup>
              <Controller
                name="studentName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tên học sinh <span className="text-destructive">*</span></FieldLabel>
                    <Input {...field} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]}></FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="contact"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel>Liên hệ</FieldLabel>
                      <Input {...field} aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSet className={"border p-2 rounded-sm"}>
            <FieldLegend>Thông tin lớp học</FieldLegend>

            <Controller
              name="classId"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Lớp</FieldLabel>
                    <ComboboxPopup
                      value={classSelected}
                      data={classes}
                      keyField="_id"
                      onValueChange={(e) => {
                        field.onChange(e._id);
                        setClassSelected(e);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldSet>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              setClassSelected(classes[0]);
            }}
          >
            Đặt lại
          </Button>
          <Button type="submit" form="form-addStudent">
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentAddForm;
