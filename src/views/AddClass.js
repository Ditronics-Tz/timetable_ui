import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import PageHeader from "../components/PageHeader";
import classService from "../services/classService";
import courseService from "../services/courseService";
import { extractApiError } from "../lib/apiError";
import { useToast } from "../components/Toast";

const empty = {
  name: "",
  course_id: "",
  year: 1,
  academic_year: "",
  number_of_students: 30,
};

export default function AddClass() {
  const navigate = useNavigate();
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    courseService
      .list({ limit: 100 })
      .then((d) => setCourses(d.courses || []))
      .catch((e) => setError(extractApiError(e)));
  }, []);

  const save = async (addAnother) => {
    setLoading(true);
    setError("");
    try {
      await classService.create({
        name: form.name,
        course_id: Number(form.course_id),
        year: Number(form.year),
        academic_year: form.academic_year || undefined,
        number_of_students: Number(form.number_of_students),
      });
      toast.success("Class created.");
      if (addAnother) setForm(empty);
      else navigate("/classes/view");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Add class"
        crumbs={[
          { label: "Classes", to: "/classes/view" },
          { label: "Add" },
        ]}
      />
      <Card className="p-6 max-w-2xl border shadow-sm space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm p-3">
            {error}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save(false);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="name">Class name *</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. BIT Y2 Group A"
            />
          </div>
          <div>
            <Label htmlFor="course_id">Program *</Label>
            <select
              id="course_id"
              className="w-full border rounded-md h-10 px-2 bg-white"
              required
              value={form.course_id}
              onChange={(e) => setForm({ ...form, course_id: e.target.value })}
            >
              <option value="">Select program</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="year">Year of study (1–6) *</Label>
            <select
              id="year"
              className="w-full border rounded-md h-10 px-2 bg-white"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              {[1, 2, 3, 4, 5, 6].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="academic_year">Academic year (calendar)</Label>
            <Input
              id="academic_year"
              value={form.academic_year}
              onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
              placeholder="e.g. 2024/25"
            />
          </div>
          <div>
            <Label htmlFor="number_of_students">Number of students *</Label>
            <Input
              id="number_of_students"
              type="number"
              min={1}
              required
              value={form.number_of_students}
              onChange={(e) => setForm({ ...form, number_of_students: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Create class"}
            </Button>
            <Button type="button" variant="outline" disabled={loading} onClick={() => save(true)}>
              Save and add another
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/classes/view")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
