import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import PageHeader from "../components/PageHeader";
import facultyService from "../services/facultyService";
import { extractApiError } from "../lib/apiError";
import { useToast } from "../components/Toast";

const empty = {
  name: "",
  description: "",
  hod_name: "",
  hod_phone: "",
  hod_email: "",
};

export default function AddDepartment() {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const save = async (addAnother) => {
    setLoading(true);
    setError("");
    try {
      await facultyService.create({
        name: formData.name,
        description: formData.description,
        hod_name: formData.hod_name,
        hod_phone: formData.hod_phone,
        hod_email: formData.hod_email,
      });
      toast.success("Department created.");
      if (addAnother) {
        setFormData(empty);
      } else {
        navigate("/departments/view");
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
        title="Add department"
        subtitle="Maps to backend Faculty"
        crumbs={[
          { label: "Departments", to: "/departments/view" },
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
            <Label htmlFor="name">Department name *</Label>
            <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="hod_name">HOD name</Label>
            <Input id="hod_name" name="hod_name" value={formData.hod_name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="hod_phone">HOD phone</Label>
            <Input id="hod_phone" name="hod_phone" value={formData.hod_phone} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="hod_email">HOD email</Label>
            <Input
              id="hod_email"
              name="hod_email"
              type="email"
              value={formData.hod_email}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Create department"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => save(true)}
            >
              Save and add another
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/departments/view")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
