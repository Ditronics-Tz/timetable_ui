import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import classService from "../services/classService";
import courseService from "../services/courseService";
import { extractApiError } from "../lib/apiError";

export default function AddClass() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    course_id: "",
    year: 1,
    academic_year: "",
    number_of_students: 30,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    courseService
      .list({ limit: 100 })
      .then((d) => setCourses(d.courses || []))
      .catch((e) => setError(extractApiError(e)));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await classService.create({
        name: form.name,
        course_id: Number(form.course_id),
        year: Number(form.year),
        academic_year: form.academic_year || undefined,
        number_of_students: Number(form.number_of_students),
      });
      setMessage("Class created.");
      setForm({
        name: "",
        course_id: "",
        year: 1,
        academic_year: "",
        number_of_students: 30,
      });
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6 max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Add Class</h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {message && <div className="text-green-700 text-sm">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Class name</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. BIT Y2 Group A"
            />
          </div>
          <div>
            <Label>Program</Label>
            <select
              className="w-full border rounded h-10 px-2"
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
            <Label>Year of Study (1–6)</Label>
            <select
              className="w-full border rounded h-10 px-2"
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
            <Label>Academic year (calendar)</Label>
            <Input
              value={form.academic_year}
              onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
              placeholder="e.g. 2024/25"
            />
          </div>
          <div>
            <Label>Number of students</Label>
            <Input
              type="number"
              min={1}
              required
              value={form.number_of_students}
              onChange={(e) =>
                setForm({ ...form, number_of_students: e.target.value })
              }
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create class"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
