import { useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import facultyService from "../services/facultyService";
import { extractApiError } from "../lib/apiError";
import "../styles/AddDepartment.css";

export default function AddDepartment() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hod_name: "",
    hod_phone: "",
    hod_email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await facultyService.create({
        name: formData.name,
        description: formData.description,
        hod_name: formData.hod_name,
        hod_phone: formData.hod_phone,
        hod_email: formData.hod_email,
      });
      setMessage("Department created successfully.");
      setFormData({
        name: "",
        description: "",
        hod_name: "",
        hod_phone: "",
        hod_email: "",
      });
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-department-container p-6">
      <Card className="p-6 max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Add New Department</h2>
        <p className="text-sm text-gray-500">Maps to backend Faculty</p>
        {error && <div className="p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
        {message && <div className="p-3 bg-green-50 text-green-800 rounded text-sm">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Department name</Label>
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
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create department"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
