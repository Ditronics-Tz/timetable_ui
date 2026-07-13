import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import courseService from "../services/courseService";
import facultyService from "../services/facultyService";
import { extractApiError } from "../lib/apiError";

export default function AddProgram() {
  const [faculties, setFaculties] = useState([]);
  const [form, setForm] = useState({
    name: "",
    faculty_id: "",
    description: "",
    level: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    facultyService
      .list({ limit: 100, offset: 0 })
      .then((d) => setFaculties(d.faculties || []))
      .catch((e) => setError(extractApiError(e)));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await courseService.create({
        name: form.name,
        faculty_id: Number(form.faculty_id),
        description: form.description,
        level: form.level,
      });
      setMessage("Program created.");
      setForm({ name: "", faculty_id: "", description: "", level: "" });
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6 max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Add Program</h2>
        <p className="text-sm text-gray-500">Maps to backend Course</p>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {message && <div className="text-green-700 text-sm">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Program name</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Department (Faculty)</Label>
            <select
              className="w-full border rounded h-10 px-2"
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
            <Label>Level (NTA / diploma / degree)</Label>
            <Input
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              placeholder="e.g. NTA Level 6"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create program"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
