import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import PageHeader from "../components/PageHeader";
import moduleService from "../services/moduleService";
import courseService from "../services/courseService";
import { extractApiError } from "../lib/apiError";
import { useToast } from "../components/Toast";

const TYPES = [
  { value: "core", label: "Core" },
  { value: "elective", label: "Elective" },
  { value: "general_subject", label: "General subject" },
];

const empty = {
  name: "",
  code: "",
  course_id: "",
  credit_hours: 3,
  type: "core",
  requires_lab: false,
  semester: "",
  nta_level: "",
};

export default function AddModule() {
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
      const payload = {
        name: form.name,
        code: form.code || undefined,
        credit_hours: Number(form.credit_hours),
        type: form.type,
        requires_lab: !!form.requires_lab,
        nta_level: form.nta_level || undefined,
      };
      if (form.semester !== "") payload.semester = Number(form.semester);
      if (form.type === "general_subject") payload.course_id = null;
      else payload.course_id = Number(form.course_id);

      await moduleService.create(payload);
      toast.success("Module created.");
      if (addAnother) setForm(empty);
      else navigate("/modules/view");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Add module"
        crumbs={[
          { label: "Modules", to: "/modules/view" },
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
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="e.g. CS201"
            />
          </div>
          <div>
            <Label htmlFor="type">Type *</Label>
            <select
              id="type"
              className="w-full border rounded-md h-10 px-2 bg-white"
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
          )}
          <div>
            <Label htmlFor="credit_hours">Credit hours *</Label>
            <Input
              id="credit_hours"
              type="number"
              min={1}
              max={10}
              required
              value={form.credit_hours}
              onChange={(e) => setForm({ ...form, credit_hours: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                type="number"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nta_level">NTA level</Label>
              <Input
                id="nta_level"
                value={form.nta_level}
                onChange={(e) => setForm({ ...form, nta_level: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="requires_lab"
              checked={form.requires_lab}
              onCheckedChange={(v) => setForm({ ...form, requires_lab: !!v })}
            />
            <Label htmlFor="requires_lab">Requires lab</Label>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Create module"}
            </Button>
            <Button type="button" variant="outline" disabled={loading} onClick={() => save(true)}>
              Save and add another
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/modules/view")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
