import { Fragment, useState } from "react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Option = { value: string; label: string };

function OptionSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(v) => onChange(v as string)}
    >
      <SelectTrigger id={id} className="w-full min-w-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function AdminEnrollmentsPage() {
  const { students, courses, enroll } = useEnrollmentStore();

  const [formStudents, setFormStudents] = useState<string[]>([]);
  const [formCourse, setFormCourse] = useState<string | null>(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [mode, setMode] = useState<"course" | "student">("course");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStudent, setFilterStudent] = useState("all");

  const studentOptions: Option[] = students.map((s) => ({
    value: s.studentId,
    label: `${s.studentId} — ${s.firstName} ${s.lastName}`,
  }));
  const courseOptions: Option[] = courses.map((c) => ({
    value: c.courseCode,
    label: `${c.courseCode} — ${c.courseTitle}`,
  }));

  // วิชาที่นักศึกษาที่เลือกยังไม่ได้ลงทะเบียน
  const availableCourseOptions = courseOptions.filter(
      // (c) =>
      // !enrollments.some(
      //   (e) => e.studentId === formStudent && e.courseId === c.value
      // )
      (c) => !formStudents.some((studentId) => 
    students.find((s) => s.studentId === studentId)?.enrolledCourses?.includes(c.value)
  )
  );
  const availableStudentOptions = studentOptions.filter((opt) => {
    if (!formCourse) return true;
    const isAlreadyEnrolled = students
      .find((s) => s.studentId === opt.value)
      ?.enrolledCourses?.includes(formCourse);

      return !isAlreadyEnrolled;
  });

  const handleEnroll = () => {
    if (!formStudents || !formCourse) return;
    enroll(formStudents, formCourse);
    setEnrollDialogOpen(false);
  };

  // เคลียร์ฟอร์มทุกครั้งที่ Dialog ปิด ไม่ว่าจะปิดเพราะลงทะเบียนสำเร็จ, กด X,
  // หรือคลิกนอก Dialog — เปิดครั้งหน้าจะได้เริ่มจากฟอร์มว่างเสมอ
  const handleEnrollDialogOpenChange = (open: boolean) => {
    setEnrollDialogOpen(open);
    if (!open) {
      setFormStudents([]);
      setFormCourse(null);
    }
  };

  const rows = students.filter((s) =>
    mode === "course"
      ? filterCourse === "all" || s.enrolledCourses?.includes(filterCourse)
      : filterStudent === "all" || s.studentId === filterStudent
  );

  const nameOf = (studentId: string) => {
    const s = students.find((x) => x.studentId === studentId);
    return s ? `${s.firstName} ${s.lastName}` : "-";
  };
  const titleOf = (courseId: string) =>
    courses.find((c) => c.courseCode === courseId)?.courseTitle ?? "-";

  const anchor = useComboboxAnchor()
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">จัดการการลงทะเบียน</h1>
        <p className="text-sm text-muted-foreground">
          Admin ลงทะเบียนและยกเลิกการลงทะเบียนให้นักศึกษาได้ทุกคน
        </p>
      </div>

      <Dialog open={enrollDialogOpen} onOpenChange={handleEnrollDialogOpenChange}>
        <DialogTrigger render={<Button />}>
          <PlusCircle className="h-4 w-4" />
          ลงทะเบียนให้นักศึกษา
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ลงทะเบียนให้นักศึกษา</DialogTitle>
            <DialogDescription>
              เลือกนักศึกษาก่อน แล้วเลือกวิชาที่ยังไม่ได้ลงทะเบียน
            </DialogDescription>
          </DialogHeader>
          <div className="grid min-w-0 gap-4">
            <div className="grid min-w-0 gap-1.5">
              <Label htmlFor="formCourse">วิชา</Label>
              <OptionSelect
                id="formCourse"
                options={availableCourseOptions}
                value={formCourse}
                placeholder={
                  formStudents && availableCourseOptions.length === 0
                    ? "ลงทะเบียนครบทุกวิชาแล้ว"
                    : "เลือกวิชา"
                }
                onChange={(v) => {
                  setFormCourse(v);
                  setFormStudents([]);
                }}
              />
            </div>
            <div className="grid min-w-0 gap-1.5">
              <Label htmlFor="formStudent">นักศึกษา</Label>
              {/* <Combobox
                id="formStudent"
                options={studentOptions}
                value={formStudents}
                placeholder="เลือกนักศึกษา"
                onChange={(v) => {
                  setFormStudents(v);
                  setFormCourse(null);
                }}
              /> */}
              <Combobox
                id="formStudent"
                multiple
                items={availableStudentOptions}
                value={formStudents}
                onValueChange={setFormStudents}
                disabled={!formCourse}
              >
                <ComboboxChips ref={anchor} className="w-full">
                  <ComboboxValue>
                    {(values) => (
                      <Fragment>
                        {values.map((value: string) => {
                          const opt = studentOptions.find((o) => o.value === value);
                          return (
                            <ComboboxChip key={value}>
                              {opt?.label ?? value}
                            </ComboboxChip>
                          );
                        })}
                        <ComboboxChipsInput
                          placeholder={
                            formStudents.length > 0 
                              ? "" // ถ้าเลือกแล้ว ให้ซ่อน placeholder เป็นค่าว่างทันที
                              : formCourse 
                                ? "เลือกนักศึกษา" 
                                : "กรุณาเลือกวิชาก่อน"
                          }
                        />
                      </Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                <ComboboxList>
                  {(item: { label: string; value: string }) => (
                    <ComboboxItem key={item.value} value={item.value}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
              </Combobox>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!formStudents || !formCourse} onClick={handleEnroll}>
              <PlusCircle className="h-4 w-4" />
              ลงทะเบียน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "course" | "student")}
      >
        <TabsList>
          <TabsTrigger value="course">ค้นหาตามวิชา</TabsTrigger>
          <TabsTrigger value="student">ค้นหาตามนักศึกษา</TabsTrigger>
        </TabsList>
        <TabsContent value="course" className="pt-2">
          <OptionSelect
            id="filterCourse"
            options={[{ value: "all", label: "ทุกวิชา" }, ...courseOptions]}
            value={filterCourse}
            onChange={setFilterCourse}
          />
        </TabsContent>
        <TabsContent value="student" className="pt-2">
          <OptionSelect
            id="filterStudent"
            options={[{ value: "all", label: "ทุกคน" }, ...studentOptions]}
            value={filterStudent}
            onChange={setFilterStudent}
          />
        </TabsContent>
      </Tabs>

      {/* <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสนักศึกษา</TableHead>
              <TableHead>ชื่อ-นามสกุล</TableHead>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลการลงทะเบียน
                </TableCell>
              </TableRow>
            )}
            {rows.map((e) => (
              <TableRow key={`${e.studentId}-${e.enrolledCourses}`}>
                <TableCell>{e.studentId}</TableCell>
                <TableCell>{nameOf(e.studentId)}</TableCell>
                <TableCell>{e.enrolledCourses}</TableCell>
                <TableCell>{titleOf(e.courseId)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div> */}
    <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>จำนวน นศ.</TableHead>
              <TableHead>นักศึกษาที่ลงทะเบียน</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลการลงทะเบียน
                </TableCell>
              </TableRow>
            )}
            {/* {rows.map((s) => (
              <TableRow key={`${s.studentId}-${s.enrolledCourses}`}>
                <TableCell>{s.enrolledCourses}</TableCell>
                <TableCell>{nameOf(s.studentId)}</TableCell>
                <TableCell>{s.enrolledCourses}</TableCell>
                <TableCell>{titleOf(s.courseId)}</TableCell>
              </TableRow>
            ))} */}
            {mode === "course" &&
              courses
                .filter((c) => filterCourse === "all" || c.courseCode === filterCourse)
                .map((course) => {
                  const enrolledStudents = students.filter((s) =>
                    s.enrolledCourses?.includes(course.courseCode)
                  );
                  return (
                    <TableRow key={course.courseCode}>
                      <TableCell className="font-medium">{course.courseCode}</TableCell>
                      <TableCell>{course.courseTitle}</TableCell>
                      <TableCell>{enrolledStudents.length}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {enrolledStudents.length > 0 ? (
                            enrolledStudents.map((s) => (
                              <span
                                key={s.studentId}
                                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                              >
                                {s.firstName} {s.lastName}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
