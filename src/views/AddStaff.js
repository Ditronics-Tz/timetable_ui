import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import staffService from "../services/staffService";
import facultyService from "../services/facultyService";
import { extractApiError } from "../lib/apiError";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function AddStaff() {
  const [faculties, setFaculties] = useState([]);
  const [unavailable, setUnavailable] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    faculty_id: "",
    max_hours: 40,
    preferred_start: "08:00",
    rfid_id: "",
    phone_number: "",
    title: "",
    staff_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    facultyService
      .list({ limit: 100 })
      .then((d) => setFaculties(d.faculties || []))
      .catch((e) => setError(extractApiError(e)));
  }, []);

  const toggleDay = (day) => {
    setUnavailable((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await staffService.create({
        name: form.name,
        email: form.email,
        faculty_id: Number(form.faculty_id),
        max_hours: Number(form.max_hours),
        rfid_id: form.rfid_id || undefined,
        phone_number: form.phone_number || undefined,
        title: form.title || undefined,
        staff_type: form.staff_type || undefined,
        preferences: {
          unavailable_days: unavailable,
          preferred_start: form.preferred_start,
        },
      });
      setMessage("Staff created.");
      setForm({
        name: "",
        email: "",
        faculty_id: "",
        max_hours: 40,
        preferred_start: "08:00",
        rfid_id: "",
        phone_number: "",
        title: "",
        staff_type: "",
      });
      setUnavailable([]);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6 max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Add Staff</h2>
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
            <Label>Email</Label>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Dr. / Mr."
              />
            </div>
            <div>
              <Label>Staff type</Label>
              <Input
                value={form.staff_type}
                onChange={(e) => setForm({ ...form, staff_type: e.target.value })}
                placeholder="full_time / part_time"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>RFID ID</Label>
              <Input
                value={form.rfid_id}
                onChange={(e) => setForm({ ...form, rfid_id: e.target.value })}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Max weekly hours</Label>
            <Input
              type="number"
              min={1}
              max={60}
              value={form.max_hours}
              onChange={(e) => setForm({ ...form, max_hours: e.target.value })}
            />
          </div>
          <div>
            <Label>Preferred start</Label>
            <Input
              value={form.preferred_start}
              onChange={(e) => setForm({ ...form, preferred_start: e.target.value })}
              placeholder="08:00"
            />
          </div>
          <div>
            <Label className="mb-2 block">Unavailable days</Label>
            <div className="grid grid-cols-2 gap-2">
              {DAYS.map((d) => (
                <div key={d} className="flex items-center gap-2">
                  <Checkbox
                    id={d}
                    checked={unavailable.includes(d)}
                    onCheckedChange={() => toggleDay(d)}
                  />
                  <Label htmlFor={d} className="capitalize">
                    {d}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create staff"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
