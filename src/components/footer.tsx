type FooterProps = {
  fullName: string;
  studentId: string;
};

export default function Footer({ fullName, studentId }: FooterProps) {
  return (
    <footer className="border-t p-4 text-center text-xs text-muted-foreground">
        จัดทำโดย {fullName} — รหัสนักศึกษา {studentId}
    </footer>
  );
}