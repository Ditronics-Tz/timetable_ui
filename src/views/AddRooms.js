import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import PageHeader from "../components/PageHeader";
import roomService from "../services/roomService";
import { extractApiError } from "../lib/apiError";
import { useToast } from "../components/Toast";

const empty = {
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
};

export default function AddRooms() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async (addAnother) => {
    setLoading(true);
    setError("");
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
      toast.success("Room created.");
      if (addAnother) setForm(empty);
      else navigate("/rooms/view");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Add room"
        crumbs={[
          { label: "Rooms", to: "/rooms/view" },
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
            <Label htmlFor="name">Room name *</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="capacity">Capacity *</Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              required
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="building">Building</Label>
              <Input
                id="building"
                value={form.building}
                onChange={(e) => setForm({ ...form, building: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="room_no">Room no.</Label>
              <Input
                id="room_no"
                value={form.room_no}
                onChange={(e) => setForm({ ...form, room_no: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
            <Label htmlFor="computers">Computers</Label>
            <Input
              id="computers"
              type="number"
              min={0}
              value={form.computers}
              onChange={(e) => setForm({ ...form, computers: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Create room"}
            </Button>
            <Button type="button" variant="outline" disabled={loading} onClick={() => save(true)}>
              Save and add another
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/rooms/view")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
