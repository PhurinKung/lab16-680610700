import { useState } from "react";
import * as React from "react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { PlusCircle, X } from "lucide-react";

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
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
//   ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Course } from "@/lib/types";


export default function AdminCoursesPage(){
    const { courses, addCourse, removeCourse, removeProf } = useEnrollmentStore();

    const [DialogOpen, setDialogOpen] = useState(false);
    const [formCourseId, setformCourseId] = useState<string | null>(null);
    const [formCourseTitle, setformCourseTitle] = useState<string | null>(null);
    const [formCourseProf, setformCourseProf] = useState<string[]>([]);
    const [formnewProf, setformnewProf] = useState("");

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setformCourseId(null);
            setformCourseTitle(null);
            setformCourseProf([]);
            setformnewProf("");
        };
    };

    const handleAddCourse = () => {
        if (!formCourseId || !formCourseTitle) return;
        const newcourse:Course = {
            courseCode: formCourseId,
            courseTitle: formCourseTitle,
            instructors: formCourseProf
        }
        addCourse(newcourse);
        
        setDialogOpen(false);
    };

  const isduplicate = courses.some(
    (c) => c.courseCode === formCourseId?.trim().toUpperCase(),
  );

   const allProf = Array.from(
    new Set(courses.flatMap((c) => c.instructors)),
   );

   const anchor = useComboboxAnchor();

   const handleAddNewProf = () => {
        const newProf = formnewProf?.trim();
        if (!newProf) return;

        setformCourseProf((prev) => [...prev, newProf]);
        setformnewProf("");
   };

    return(
        <div className="space-y-4">
            <div>
                <h1 className="text-xl font-semibold">จัดการวิชาเรียน</h1>
                <p className="text-sm text-muted-foreground">
                    2 วิชา — เพิ่มวิชาใหม่ที่นี่แล้วจะไปโผล่เป็นตัวเลือก ตอนลงทะเบียนให้นักศึกษาที่หน้า "จัดการการลงทะเบียน" ทันที
                </p>
            </div>
            <Dialog open={DialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger render={<Button />}>
                <PlusCircle className="h-4 w-4" />
                    เพิ่มวิชา
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
                    <DialogDescription>
                    วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
                    </DialogDescription>
                </DialogHeader>
               <div className="grid min-w-0 gap-4">
                <div className="grid min-w-0 gap-1.5">
                    <Label htmlFor="formCourseId">รหัสวิชา</Label>
                    <Input
                    aria-invalid={isduplicate}
                    aria-describedby={
                        isduplicate ? "formCourseId-error" : undefined
                    }
                    id="formCourseId"
                    placeholder="เช่น CPE303"
                    value={formCourseId ?? ""}
                    onChange={(c) => setformCourseId(c.target.value)}
                    />
                    {isduplicate && (
                        <div className="text-red-500">มีรหัสวิชา {formCourseId?.toUpperCase()} นี้แล้ว</div>
                    )}
                    {/* {
                        const hasError = Object.values(isduplicate).some((isError) => isError);
                        if (hasError) return;
                    } */}
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="formCourseTitle">ชื่อวิชา</Label>
                        <Input
                        id="formCourseTitle"
                        placeholder="เช่น Mobile Aplication Development"
                        value={formCourseTitle ?? ""}
                        onChange={(c) => setformCourseTitle(c.target.value)}
                        />
                    </div>
                    <div className="grid min-w-0 gap-1.5">
                        <Label htmlFor="formCourseProf">ผู้สอน</Label>
                        <Combobox
                        multiple
                        autoHighlight
                        id="formCourseProf"
                        items={allProf}
                        value={formCourseProf}
                        onValueChange={(v) => setformCourseProf(v as string[])}
                        >
                        <ComboboxChips
                            ref={anchor}
                            className="flex min-h-8 flex-wrap items-center gap-1 rounded-lg min-w-0"
                        >
                            <ComboboxValue>
                            {(values) => (
                                <React.Fragment>
                                {values.map((value: string) => (
                                    <ComboboxChip key={value}>{value}</ComboboxChip>
                                ))}
                                <ComboboxChipsInput
                                    placeholder={
                                    formCourseProf?.length
                                        ? ""
                                        : "เลือกหรือพิมพ์ชื่อผู้สอน (ได้หลายคน)"
                                    }
                                    onChange={(e) => setformnewProf(e.target.value)}
                                    value={formnewProf}
                                />
                                </React.Fragment>
                            )}
                            </ComboboxValue>
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                            {/* <ComboboxEmpty>No items found.</ComboboxEmpty> */}
                            <ComboboxList>
                                {(item) => (
                                    <ComboboxItem onClick={() => setformnewProf("")} key={item} value={item}>
                                        {item}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                            {allProf.find((p) => p === formnewProf) === undefined && formnewProf!=="" &&(
                                <Button onClick={handleAddNewProf} variant="ghost" className="justify-start min-w-0 w-full">+ เพิ่มผู้สอน "{formnewProf}"</Button>
                            )}
                            
                        </ComboboxContent>
                        </Combobox>
                    </div>
                </div>

                <DialogFooter>
                    {/* <Button disabled={!formStudents || !formCourse} onClick={handleAddCourse}>
                    <PlusCircle className="h-4 w-4" />
                        บันทึก
                    </Button> */}
                    <Button
                        disabled={
                        !formCourseId ||
                        !formCourseTitle ||
                        !formCourseProf?.length ||
                        isduplicate
                        }
                        onClick={handleAddCourse}
                    >
                        บันทึก
                    </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>

            <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>ผู้สอน</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((n) => (
              <TableRow key={`${n.courseCode}`}>
                <TableCell>{n.courseCode}</TableCell>
                <TableCell>{n.courseTitle}</TableCell>
                <TableCell>
                  {n.instructors?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {n.instructors.map((i) => (
                        <div className="flex flex-wrap gap-1.5">
                          <Badge
                            key={i}
                            variant="outline"
                            className="gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
                          >
                            {i}
                            <Button
                              size="xs"
                              variant="ghost"
                              className="rounded-full p-0.5 hover:bg-blue-800/60"
                              onClick={() => removeProf(i, n.courseCode)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      ยังไม่มีผู้สอน
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 />
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ลบวิชา?</AlertDialogTitle>
                        <AlertDialogDescription>
                          ลบ {n.courseCode} — {n.courseTitle}{" "}
                          ออกจากรายวิชาที่เปิดสอน
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => removeCourse(n.courseCode)}
                        >
                          ยืนยัน
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
        </div>

        
    )
}