const pause = () => new Promise((resolve) => setTimeout(resolve, 120));

export const sampleMembers = [
  { id: 1, name: "Asha Mwakalinga", email: "asha@example.edu", role: "lecturer", status: "active" },
  { id: 2, name: "Daniel Mushi", email: "daniel@example.edu", role: "academic_coordinator", status: "invited" },
];
const initialMembers = sampleMembers.map((member) => ({ ...member }));

export const sampleInstitutions = [
  { name: "Sacas Institute of Technology", region: "Dar es Salaam", status: "pending" },
  { name: "Lake Zone College", region: "Mwanza", status: "active" },
];

export const sampleAnalytics = [
  { label: "Scheduled classes", value: "86%", detail: "Classes with a published timetable" },
  { label: "Room utilisation", value: "72%", detail: "Booked room hours this week" },
  { label: "Lecturer load", value: "18.4 h", detail: "Average scheduled hours per lecturer" },
  { label: "Unscheduled classes", value: "7", detail: "Classes that still need sessions" },
];

export async function loadMembers() {
  await pause();
  return sampleMembers.map((member) => ({ ...member }));
}

export async function createMember(input) {
  await pause();
  const member = { id: Date.now(), ...input, status: "invited" };
  sampleMembers.push(member);
  return { ...member };
}

export async function updateMember(id, changes) {
  await pause();
  const index = sampleMembers.findIndex((member) => member.id === id);
  if (index < 0) throw new Error("The sample member no longer exists.");
  sampleMembers[index] = { ...sampleMembers[index], ...changes };
  return { ...sampleMembers[index] };
}

export async function deactivateMember(id) {
  return updateMember(id, { status: "suspended" });
}

export function resetUiShellFixtures() {
  sampleMembers.splice(0, sampleMembers.length, ...initialMembers.map((member) => ({ ...member })));
}

export async function submitInstitutionRegistration(input) {
  await pause();
  return { accepted: true, email: input.admin.email };
}
