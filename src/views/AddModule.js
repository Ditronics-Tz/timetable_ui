import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import moduleService from "../services/moduleService";
import courseService from "../services/courseService";
import { extractApiError } from "../lib/apiError";

const TYPES = [
  { value: "core", label: "Core" },
  { value: "elective", label: "Elective" },
  { value: "general_subject", label: "General subject" },
];

export default function AddModule() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    code: "",
    course_id: "",
    credit_hours: 3,
    type: "core",
    requires_lab: false,
    semester: "",
    nta_level: "",
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
      const payload = {
        name: form.name,
        code: form.code || undefined,
        credit_hours: Number(form.credit_hours),
        type: form.type,
        requires_lab: !!form.requires_lab,
        nta_level: form.nta_level || undefined,
      };
      if (form.semester !== "") payload.semester = Number(form.semester);
      if (form.type === "general_subject") {
        payload.course_id = null;
      } else {
        payload.course_id = Number(form.course_id);
      }
      await moduleService.create(payload);
      setMessage("Module created.");
      setForm({
        name: "",
        code: "",
        course_id: "",
        credit_hours: 3,
        type: "core",
        requires_lab: false,
        semester: "",
        nta_level: "",
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
        <h2 className="text-2xl font-bold">Add Module</h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {message && <div className="text-green-700 text-sm">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Code</Label>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="e.g. CS201"
            />
          </div>
          <div>
            <Label>Type</Label>
            <select
              className="w-full border rounded h-10 px-2"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          {form.type !== "general_subject" && (
            <div>
              <Label>Program (Course)</Label>
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
          )}
          <div>
            <Label>Credit hours</Label>
            <Input
              type="number"
              min={1}
              max={10}
              required
              value={form.credit_hours}
              onChange={(e) => setForm({ ...form, credit_hours: e.target.value })}
            />
          </div>
          <div>
            <Label>Semester</Label>
            <Input
              type="number"
              min={1}
              max={2}
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
            />
          </div>
          <div>
            <Label>NTA level</Label>
            <Input
              value={form.nta_level}
              onChange={(e) => setForm({ ...form, nta_level: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="requires_lab"
              checked={form.requires_lab}
              onCheckedChange={(v) => setForm({ ...form, requires_lab: !!v })}
            />
            <Label htmlFor="requires_lab">Requires lab</Label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create module"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
