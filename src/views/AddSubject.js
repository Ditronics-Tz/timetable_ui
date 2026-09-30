import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import PageHeader from "../components/PageHeader";
import { useToast } from "../components/Toast";
import { extractApiError } from "../lib/apiError";
import subjectService from "../services/subjectService";

const emptyForm = { name: "", credit_hours: "3" };

export default function AddSubject() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async (addAnother = false) => {
    setLoading(true);
    setError("");
    try {
      await subjectService.create({
        name: form.name.trim(),
        credit_hours: Number(form.credit_hours),
      });
      toast.success("Subject created.");
      if (addAnother) setForm(emptyForm);
      else navigate("/subjects/view");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Add subject" crumbs={[{ label: "Subjects", to: "/subjects/view" }, { label: "Add" }]} />
      <Card className="p-6 max-w-2xl border shadow-sm space-y-4">
        {error && <div role="alert" className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>}
        <form onSubmit={(event) => { event.preventDefault(); save(); }} className="space-y-4">
          <div>
            <Label htmlFor="subject-name">Name *</Label>
            <Input id="subject-name" required minLength={2} maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>
          <div>
            <Label htmlFor="subject-credit-hours">Credit hours *</Label>
            <Input id="subject-credit-hours" type="number" min={1} max={10} required value={form.credit_hours} onChange={(event) => setForm({ ...form, credit_hours: event.target.value })} />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Create subject"}</Button>
            <Button type="button" variant="outline" disabled={loading} onClick={() => save(true)}>Save and add another</Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/subjects/view")}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
