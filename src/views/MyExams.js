import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import examService from "../services/examService";
import { extractApiError } from "../lib/apiError";

export default function MyExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    examService
      .getMyExams()
      .then((res) => {
        if (active) setExams(res?.exams || []);
      })
      .catch((err) => {
        if (active) setError(extractApiError(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Exams & Invigilation"
        subtitle="Your personal examination invigilation and module assessment schedule."
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "My Exams" },
        ]}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print?.()}
          >
            Print
          </Button>
        }
      />

      <Card className="p-6 space-y-4">
        {loading ? (
          <p role="status" className="py-8 text-center text-slate-500">
            Loading your exam duties…
          </p>
        ) : error ? (
          <div role="alert" className="text-sm text-red-700">
            {error}
          </div>
        ) : exams.length === 0 ? (
          <p role="status" className="py-8 text-center text-slate-500 text-sm">
            No exam invigilation sessions are assigned to you yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table
              aria-label="My exam invigilation schedule"
              className="min-w-full text-left text-sm"
            >
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-3 py-2">Exam / Module</th>
                  <th className="px-3 py-2">Class</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Room</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="border-b">
                    <td className="px-3 py-2 font-medium">
                      {exam.title || exam.module_name || `Exam #${exam.id}`}
                    </td>
                    <td className="px-3 py-2">
                      {exam.class_name || `Class #${exam.class_id || "—"}`}
                    </td>
                    <td className="px-3 py-2">{exam.exam_date}</td>
                    <td className="px-3 py-2">
                      {exam.start_time} - {exam.end_time}
                    </td>
                    <td className="px-3 py-2">
                      {exam.room_name || `Room #${exam.room_id || "—"}`}
                    </td>
                    <td className="px-3 py-2 capitalize">
                      {exam.status || "scheduled"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
