import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import institutionService from "../services/institutionService";
import { setInstitution } from "../lib/auth";
import { extractApiError } from "../lib/apiError";

const ALL_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function InstitutionSettings() {
  const [org, setOrg] = useState({
    name: "",
    type: "university",
    region: "",
    country: "Tanzania",
    email: "",
    phone: "",
    address: "",
    logo_url: "",
  });
  const [schedule, setSchedule] = useState({
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    day_start: "08:00",
    day_end: "17:00",
    slot_duration_minutes: 60,
    break_start: "12:00",
    break_end: "13:00",
  });
  const [loading, setLoading] = useState(true);
  const [savingOrg, setSavingOrg] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      institutionService.getInstitution().catch(() => null),
      institutionService.getScheduleSettings().catch(() => null),
    ])
      .then(([instRes, schedRes]) => {
        if (!active) return;
        const inst = instRes?.institution || instRes;
        if (inst) {
          setOrg((prev) => ({
            ...prev,
            name: inst.name || prev.name,
            type: inst.type || prev.type,
            region: inst.region || prev.region,
            country: inst.country || prev.country,
            email: inst.email || prev.email,
            phone: inst.phone || prev.phone,
            address: inst.address || prev.address,
            logo_url: inst.logo_url || prev.logo_url,
          }));
        }
        const sched = schedRes?.schedule || schedRes;
        if (sched) {
          const firstBreak = Array.isArray(sched.breaks) ? sched.breaks[0] : null;
          setSchedule((prev) => ({
            ...prev,
            days:
              Array.isArray(sched.days) && sched.days.length > 0
                ? sched.days
                : prev.days,
            day_start: sched.day_start || prev.day_start,
            day_end: sched.day_end || prev.day_end,
            slot_duration_minutes:
              sched.slot_duration_minutes || prev.slot_duration_minutes,
            break_start: firstBreak?.start_time || prev.break_start,
            break_end: firstBreak?.end_time || prev.break_end,
          }));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const toggleDay = (day) => {
    setSchedule((prev) => {
      const exists = prev.days.includes(day);
      const nextDays = exists
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];
      return { ...prev, days: nextDays };
    });
  };

  const handleSaveOrg = async (event) => {
    event.preventDefault();
    setSavingOrg(true);
    setError("");
    setMessage("");
    try {
      const res = await institutionService.updateInstitution(org);
      const updated = res?.institution || org;
      setInstitution(updated);
      setMessage("Institution profile updated.");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setSavingOrg(false);
    }
  };

  const handleSaveSchedule = async (event) => {
    event.preventDefault();
    setSavingSchedule(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        days: schedule.days,
        day_start: schedule.day_start,
        day_end: schedule.day_end,
        slot_duration_minutes: Number(schedule.slot_duration_minutes),
        breaks:
          schedule.break_start && schedule.break_end
            ? [
                {
                  start_time: schedule.break_start,
                  end_time: schedule.break_end,
                  label: "Break",
                },
              ]
            : [],
      };
      await institutionService.updateScheduleSettings(payload);
      try {
        localStorage.setItem(
          "sacas_schedule_settings",
          JSON.stringify(payload)
        );
      } catch {
        // ignore storage errors
      }
      setMessage("Institution schedule settings saved.");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setSavingSchedule(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution settings"
        subtitle="Manage your institution profile, logo, teaching days, and timetable slot hours."
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Institution Settings" },
        ]}
      />

      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      {message && (
        <div
          role="status"
          className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {message}
        </div>
      )}

      {loading ? (
        <p role="status" className="text-sm text-slate-500">
          Loading institution settings…
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Organization profile</h2>
            <form onSubmit={handleSaveOrg} className="space-y-4">
              <div>
                <Label htmlFor="org-name">Institution name *</Label>
                <Input
                  id="org-name"
                  required
                  value={org.name}
                  onChange={(e) => setOrg({ ...org, name: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="org-type">Type</Label>
                  <select
                    id="org-type"
                    className="h-10 w-full rounded-md border px-3 bg-white"
                    value={org.type}
                    onChange={(e) => setOrg({ ...org, type: e.target.value })}
                  >
                    <option value="university">University</option>
                    <option value="college">College</option>
                    <option value="school">School</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="org-region">Region</Label>
                  <Input
                    id="org-region"
                    value={org.region}
                    onChange={(e) => setOrg({ ...org, region: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="org-country">Country</Label>
                  <Input
                    id="org-country"
                    value={org.country}
                    onChange={(e) =>
                      setOrg({ ...org, country: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="org-phone">Phone</Label>
                  <Input
                    id="org-phone"
                    value={org.phone}
                    onChange={(e) => setOrg({ ...org, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="org-email">Official email</Label>
                <Input
                  id="org-email"
                  type="email"
                  value={org.email}
                  onChange={(e) => setOrg({ ...org, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="org-address">Address</Label>
                <Input
                  id="org-address"
                  value={org.address}
                  onChange={(e) => setOrg({ ...org, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="org-logo">Logo URL</Label>
                <Input
                  id="org-logo"
                  placeholder="https://example.edu/logo.png"
                  value={org.logo_url}
                  onChange={(e) =>
                    setOrg({ ...org, logo_url: e.target.value })
                  }
                />
              </div>
              <Button type="submit" disabled={savingOrg}>
                {savingOrg ? "Saving…" : "Save organization profile"}
              </Button>
            </form>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              Academic schedule settings
            </h2>
            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Teaching days</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ALL_DAYS.map((day) => (
                    <label
                      key={day}
                      className="flex items-center gap-2 text-sm capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={schedule.days.includes(day)}
                        onChange={() => toggleDay(day)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="sched-start">Day start time</Label>
                  <Input
                    id="sched-start"
                    value={schedule.day_start}
                    onChange={(e) =>
                      setSchedule({ ...schedule, day_start: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sched-end">Day end time</Label>
                  <Input
                    id="sched-end"
                    value={schedule.day_end}
                    onChange={(e) =>
                      setSchedule({ ...schedule, day_end: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sched-slot-duration">
                  Slot duration (minutes)
                </Label>
                <Input
                  id="sched-slot-duration"
                  type="number"
                  min={30}
                  max={180}
                  step={15}
                  value={schedule.slot_duration_minutes}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      slot_duration_minutes: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="sched-break-start">Break start</Label>
                  <Input
                    id="sched-break-start"
                    value={schedule.break_start}
                    onChange={(e) =>
                      setSchedule({ ...schedule, break_start: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sched-break-end">Break end</Label>
                  <Input
                    id="sched-break-end"
                    value={schedule.break_end}
                    onChange={(e) =>
                      setSchedule({ ...schedule, break_end: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button type="submit" disabled={savingSchedule}>
                {savingSchedule ? "Saving…" : "Save schedule settings"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
