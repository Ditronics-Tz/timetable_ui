import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import PageHeader from "../components/PageHeader";
import staffService from "../services/staffService";
import facultyService from "../services/facultyService";
import { extractApiError } from "../lib/apiError";
import { useToast } from "../components/Toast";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const empty = {
  name: "",
  email: "",
  faculty_id: "",
  max_hours: 40,
  preferred_start: "08:00",
  rfid_id: "",
  phone_number: "",
  title: "",
  staff_type: "",
};

export default function AddStaff() {
  const navigate = useNavigate();
  const toast = useToast();
  const [faculties, setFaculties] = useState([]);
  const [unavailable, setUnavailable] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const save = async (addAnother) => {
    setLoading(true);
    setError("");
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
      toast.success("Staff created.");
      if (addAnother) {
        setForm(empty);
        setUnavailable([]);
      } else {
        navigate("/staff/view");
      }
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Add staff"
        crumbs={[
          { label: "Staff", to: "/staff/view" },
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
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Dr. / Mr."
              />
            </div>
            <div>
              <Label htmlFor="staff_type">Staff type</Label>
              <Input
                id="staff_type"
                value={form.staff_type}
                onChange={(e) => setForm({ ...form, staff_type: e.target.value })}
                placeholder="full_time / part_time"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="rfid_id">RFID ID</Label>
              <Input
                id="rfid_id"
                value={form.rfid_id}
                onChange={(e) => setForm({ ...form, rfid_id: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone_number">Phone</Label>
              <Input
                id="phone_number"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="max_hours">Max weekly hours</Label>
            <Input
              id="max_hours"
              type="number"
              min={1}
              max={60}
              value={form.max_hours}
              onChange={(e) => setForm({ ...form, max_hours: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="preferred_start">Preferred start</Label>
            <Input
              id="preferred_start"
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
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Create staff"}
            </Button>
            <Button type="button" variant="outline" disabled={loading} onClick={() => save(true)}>
              Save and add another
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/staff/view")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
