import { useCallback, useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import CsvImport from "../components/CsvImport";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import examService from "../services/examService";
import { can } from "../lib/auth";
import { extractApiError } from "../lib/apiError";

export default function Exams() {
  const [tab, setTab] = useState("list"); // list | create | periods | generate
  const [exams, setExams] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [examForm, setExamForm] = useState({
    title: "",
    module_id: "",
    class_id: "",
    room_id: "",
    invigilator_id: "",
    exam_date: "2026-11-10",
    start_time: "09:00",
    end_time: "12:00",
  });

  const [periodForm, setPeriodForm] = useState({
    name: "",
    academic_year: "2026/27",
    semester: 1,
    start_date: "2026-11-09",
    end_date: "2026-11-20",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [examRes, periodRes] = await Promise.all([
        examService.listExams(),
        examService.listExamPeriods().catch(() => ({ exam_periods: [] })),
      ]);
      setExams(examRes?.exams || []);
      setPeriods(periodRes?.exam_periods || []);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (examId, nextStatus) => {
    setError("");
    setMessage("");
    try {
      await examService.updateExamStatus(examId, nextStatus);
      setExams((prev) =>
        prev.map((e) => (e.id === examId ? { ...e, status: nextStatus } : e))
      );
      setMessage(`Exam #${examId} updated to ${nextStatus}.`);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const handleCreateExam = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = {
        title: examForm.title,
        module_id: examForm.module_id ? Number(examForm.module_id) : undefined,
        class_id: examForm.class_id ? Number(examForm.class_id) : undefined,
        room_id: examForm.room_id ? Number(examForm.room_id) : undefined,
        invigilator_id: examForm.invigilator_id
          ? Number(examForm.invigilator_id)
          : undefined,
        exam_date: examForm.exam_date,
        start_time: examForm.start_time,
        end_time: examForm.end_time,
      };
      const res = await examService.createExam(payload);
      const created = res?.exam || { id: Date.now(), status: "scheduled", ...payload };
      setExams((prev) => [created, ...prev]);
      setMessage("Exam scheduled without room or invigilator conflicts.");
      setTab("list");
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const handleCreatePeriod = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await examService.createExamPeriod({
        ...periodForm,
        semester: Number(periodForm.semester),
      });
      const created = res?.exam_period || { id: Date.now(), ...periodForm };
      setPeriods((prev) => [created, ...prev]);
      setMessage("Exam period created.");
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const handleGenerateExams = async () => {
    setError("");
    setMessage("");
    try {
      const res = await examService.generateExamTimetable({});
      if (Array.isArray(res?.exams)) {
        setExams(res.exams);
      }
      setMessage(
        `${res?.message || "Exam timetable generated"} (${
          res?.count ?? res?.exams?.length ?? 0
        } sessions).`
      );
      setTab("list");
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examinations & Invigilation"
        subtitle="Schedule exams, manage exam periods, and approve or publish examination timetables."
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Exams" },
        ]}
      />

      <CsvImport
        entity="exams"
        columns={[
          "title",
          "module_code",
          "class_name",
          "exam_date",
          "start_time",
          "end_time",
          "room_name",
          "invigilator_email",
        ]}
        sampleRow={[
          "CS201 Final Exam",
          "CS201",
          "BIT Y2 Group A",
          "2026-11-10",
          "09:00",
          "12:00",
          "Hall 1",
          "asha@sacas.ac.tz",
        ]}
      />

      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      {message && (
        <div
          role="status"
          className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Exam management tabs">
        {[
          ["list", "Exam Schedule"],
          ["create", "Schedule Exam"],
          ["periods", "Exam Periods"],
          ["generate", "Auto-Generate"],
        ].map(([key, label]) => (
          <Button
            key={key}
            type="button"
            variant={tab === key ? "default" : "outline"}
            size="sm"
            onClick={() => setTab(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {tab === "list" && (
        <Card className="p-5 space-y-4">
          <h2 className="font-semibold text-slate-900">Scheduled examinations</h2>
          {loading ? (
            <p role="status">Loading exams…</p>
          ) : exams.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No exams scheduled yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-3 py-2">Exam / Module</th>
                    <th className="px-3 py-2">Class</th>
                    <th className="px-3 py-2">Date &amp; Time</th>
                    <th className="px-3 py-2">Room</th>
                    <th className="px-3 py-2">Invigilator</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Workflow</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.id} className="border-b">
                      <td className="px-3 py-2 font-medium">
                        {exam.title || exam.module_name || `Module #${exam.module_id}`}
                      </td>
                      <td className="px-3 py-2">
                        {exam.class_name || `Class #${exam.class_id || "—"}`}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {exam.exam_date} · {exam.start_time}-{exam.end_time}
                      </td>
                      <td className="px-3 py-2">
                        {exam.room_name || `Room #${exam.room_id || "—"}`}
                      </td>
                      <td className="px-3 py-2">
                        {exam.invigilator_name ||
                          (exam.invigilator_id
                            ? `Staff #${exam.invigilator_id}`
                            : "—")}
                      </td>
                      <td className="px-3 py-2 capitalize">
                        <span className="rounded-full border px-2 py-0.5 text-xs bg-slate-100">
                          {exam.status || "draft"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1.5">
                          {can("exams:approve") && exam.status !== "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleStatusChange(exam.id, "approved")
                              }
                            >
                              Approve
                            </Button>
                          )}
                          {can("exams:publish") && exam.status !== "published" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleStatusChange(exam.id, "published")
                              }
                            >
                              Publish
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {tab === "create" && (
        <Card className="max-w-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Schedule an examination</h2>
          <form onSubmit={handleCreateExam} className="space-y-4">
            <div>
              <Label htmlFor="exam-title">Exam title *</Label>
              <Input
                id="exam-title"
                required
                value={examForm.title}
                onChange={(e) =>
                  setExamForm({ ...examForm, title: e.target.value })
                }
                placeholder="e.g. CS201 Algorithms Final Exam"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="exam-module-id">Module ID</Label>
                <Input
                  id="exam-module-id"
                  type="number"
                  value={examForm.module_id}
                  onChange={(e) =>
                    setExamForm({ ...examForm, module_id: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="exam-class-id">Class ID</Label>
                <Input
                  id="exam-class-id"
                  type="number"
                  value={examForm.class_id}
                  onChange={(e) =>
                    setExamForm({ ...examForm, class_id: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="exam-room-id">Room ID</Label>
                <Input
                  id="exam-room-id"
                  type="number"
                  value={examForm.room_id}
                  onChange={(e) =>
                    setExamForm({ ...examForm, room_id: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="exam-invigilator-id">Invigilator Staff ID</Label>
                <Input
                  id="exam-invigilator-id"
                  type="number"
                  value={examForm.invigilator_id}
                  onChange={(e) =>
                    setExamForm({ ...examForm, invigilator_id: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="exam-date">Exam date *</Label>
                <Input
                  id="exam-date"
                  type="date"
                  required
                  value={examForm.exam_date}
                  onChange={(e) =>
                    setExamForm({ ...examForm, exam_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="exam-start">Start time *</Label>
                <Input
                  id="exam-start"
                  required
                  value={examForm.start_time}
                  onChange={(e) =>
                    setExamForm({ ...examForm, start_time: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="exam-end">End time *</Label>
                <Input
                  id="exam-end"
                  required
                  value={examForm.end_time}
                  onChange={(e) =>
                    setExamForm({ ...examForm, end_time: e.target.value })
                  }
                />
              </div>
            </div>
            <Button type="submit">Save exam session</Button>
          </form>
        </Card>
      )}

      {tab === "periods" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Create exam period</h2>
            <form onSubmit={handleCreatePeriod} className="space-y-3">
              <div>
                <Label htmlFor="period-name">Period name *</Label>
                <Input
                  id="period-name"
                  required
                  value={periodForm.name}
                  onChange={(e) =>
                    setPeriodForm({ ...periodForm, name: e.target.value })
                  }
                  placeholder="Semester 1 Final Exams"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="period-ay">Academic year</Label>
                  <Input
                    id="period-ay"
                    value={periodForm.academic_year}
                    onChange={(e) =>
                      setPeriodForm({
                        ...periodForm,
                        academic_year: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="period-sem">Semester</Label>
                  <Input
                    id="period-sem"
                    type="number"
                    min={1}
                    max={3}
                    value={periodForm.semester}
                    onChange={(e) =>
                      setPeriodForm({ ...periodForm, semester: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="period-start">Start date</Label>
                  <Input
                    id="period-start"
                    type="date"
                    value={periodForm.start_date}
                    onChange={(e) =>
                      setPeriodForm({
                        ...periodForm,
                        start_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="period-end">End date</Label>
                  <Input
                    id="period-end"
                    type="date"
                    value={periodForm.end_date}
                    onChange={(e) =>
                      setPeriodForm({ ...periodForm, end_date: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button type="submit">Create period</Button>
            </form>
          </Card>

          <Card className="p-6 space-y-3">
            <h2 className="text-lg font-semibold">Configured exam periods</h2>
            <ul className="divide-y text-sm">
              {periods.map((p) => (
                <li key={p.id || p.name} className="py-2.5 flex justify-between">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      {p.start_date} to {p.end_date} · {p.academic_year} (Sem{" "}
                      {p.semester})
                    </p>
                  </div>
                  <span className="text-xs capitalize text-slate-600">
                    {p.status || "active"}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "generate" && (
        <Card className="max-w-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            Auto-generate examination timetable
          </h2>
          <p className="text-sm text-slate-600">
            Automatically assign classes, rooms (respecting seating capacity),
            and invigilators across the active examination period without
            clashes.
          </p>
          <Button type="button" onClick={handleGenerateExams}>
            Generate exam timetable now
          </Button>
        </Card>
      )}
    </div>
  );
}
