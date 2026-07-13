import { useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import roomService from "../services/roomService";
import { extractApiError } from "../lib/apiError";

export default function AddRooms() {
  const [form, setForm] = useState({
    name: "",
    capacity: 40,
    sticky: false,
    projector: false,
    lab: false,
    studio: false,
    ac: false,
    whiteboard: true,
    computers: 0,
    building: "",
    room_no: "",
    description: "",
    room_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const features = {
        projector: form.projector,
        lab: form.lab,
        studio: form.studio,
        ac: form.ac,
        whiteboard: form.whiteboard,
        computers: Number(form.computers) || 0,
        building: form.building,
        room_no: form.room_no,
        description: form.description,
        room_type: form.room_type,
      };
      await roomService.create({
        name: form.name,
        capacity: Number(form.capacity),
        sticky: form.sticky,
        features,
      });
      setMessage("Room created.");
      setForm({
        name: "",
        capacity: 40,
        sticky: false,
        projector: false,
        lab: false,
        studio: false,
        ac: false,
        whiteboard: true,
        computers: 0,
        building: "",
        room_no: "",
        description: "",
        room_type: "",
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
        <h2 className="text-2xl font-bold">Add Room</h2>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Building</Label>
              <Input
                value={form.building}
                onChange={(e) => setForm({ ...form, building: e.target.value })}
              />
            </div>
            <div>
              <Label>Room no</Label>
              <Input
                value={form.room_no}
                onChange={(e) => setForm({ ...form, room_no: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Room type</Label>
            <Input
              value={form.room_type}
              onChange={(e) => setForm({ ...form, room_type: e.target.value })}
              placeholder="lecture / lab / studio"
            />
          </div>
          <div>
            <Label>Capacity</Label>
            <Input
              type="number"
              min={1}
              required
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["projector", "Projector"],
              ["lab", "Lab"],
              ["studio", "Studio"],
              ["ac", "AC"],
              ["whiteboard", "Whiteboard"],
              ["sticky", "Sticky room"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={key}
                  checked={!!form[key]}
                  onCheckedChange={(v) => setForm({ ...form, [key]: !!v })}
                />
                <Label htmlFor={key}>{label}</Label>
              </div>
            ))}
          </div>
          <div>
            <Label>Computers</Label>
            <Input
              type="number"
              min={0}
              value={form.computers}
              onChange={(e) => setForm({ ...form, computers: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create room"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
