import { useState } from "react";
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

export default function AdminCoursesPage(){
    return(
        <div className="space-y-4">
            <div>
                <h1 className="text-xl font-semibold">จัดการการลงทะเบียน</h1>
                <p className="text-sm text-muted-foreground">
                Admin ลงทะเบียนและยกเลิกการลงทะเบียนให้นักศึกษาได้ทุกคน
                </p>
            </div>

            
        </div>
    )
}