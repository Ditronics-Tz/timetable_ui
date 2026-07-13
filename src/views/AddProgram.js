import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import PageHeader from "../components/PageHeader";
import courseService from "../services/courseService";
import facultyService from "../services/facultyService";
import { extractApiError } from "../lib/apiError";
import { useToast } from "../components/Toast";

const empty = { name: "", faculty_id: "", description: "", level: "" };

export default function AddProgram() {
  const navigate = useNavigate();
  const toast = useToast();
  const [faculties, setFaculties] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    facultyService
      .list({ limit: 100, offset: 0 })
      .then((d) => setFaculties(d.faculties || []))
      .catch((e) => setError(extractApiError(e)));
  }, []);

  const save = async (addAnother) => {
    setLoading(true);
    setError("");
    try {
      await courseService.create({
        name: form.name,
        faculty_id: Number(form.faculty_id),
        description: form.description,
        level: form.level,
      });
      toast.success("Program created.");
      if (addAnother) setForm(empty);
      else navigate("/programs/view");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Add program"
        subtitle="Maps to backend Course"
        crumbs={[
          { label: "Programs", to: "/programs/view" },
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
            <Label htmlFor="name">Program name *</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="faculty_id">Department (Faculty) *</Label>
            <select
              id="faculty_id"
              className="w-full border rounded-md h-10 px-2 bg-white"
              required
              value={form.faculty_id}
              onChange={(e) => setForm({ ...form, faculty_id: e.target.value })}
            >
              <option value="">Select department</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="level">Level (NTA / diploma / degree)</Label>
            <Input
              id="level"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              placeholder="e.g. NTA Level 6"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Create program"}
            </Button>
            <Button type="button" variant="outline" disabled={loading} onClick={() => save(true)}>
              Save and add another
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/programs/view")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
