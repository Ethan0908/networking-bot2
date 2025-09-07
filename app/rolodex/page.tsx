"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

// Minimal contact type matching your DB columns used by n8n
interface Contact {
  id: string;
  full_name: string | null;
  title: string | null;
  company: string | null;
  location: string | null;
  profile_url: string | null;
  profile_id: string | null;
  email: string | null;
  updated_at?: string;
}

export default function RolodexUI() {
  // Replace this with your signed-in user id from your app/session
  const [userId, setUserId] = useState<string>("user_001");

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);

  const [createForm, setCreateForm] = useState<Omit<Contact, "id">>({
    full_name: "",
    title: "",
    company: "",
    location: "",
    profile_url: "",
    profile_id: "",
    email: "",
  });

  const canLoad = useMemo(() => Boolean(userId?.trim()), [userId]);

  async function callRolodex(payload: any) {
    const res = await fetch("/api/rolodex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text || `Request failed (${res.status})`);
    // n8n returns text for non-view; for view, it returns JSON array
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  async function loadContacts() {
    if (!canLoad) return;
    setLoading(true);
    try {
      const data: Contact[] = await callRolodex({ action: "view", user_external_id: userId });
      setContacts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function createContact() {
    setCreating(true);
    try {
      await callRolodex({ action: "create", user_external_id: userId, ...createForm });
      toast.success("Contact created");
      setCreateForm({ full_name: "", title: "", company: "", location: "", profile_url: "", profile_id: "", email: "" });
      await loadContacts();
    } catch (e: any) {
      toast.error(e.message || "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function updateContact(contact: Contact) {
    try {
      await callRolodex({ action: "update", user_external_id: userId, contact_id: contact.id, title: contact.title, company: contact.company, location: contact.location, email: contact.email });
      toast.success("Saved");
      await loadContacts();
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    }
  }

  async function sendEmail(contactId: string, subject?: string, message?: string) {
    try {
      await callRolodex({ action: "email", user_external_id: userId, contact_id: contactId, subject, message });
      toast.success("Email sent");
    } catch (e: any) {
      toast.error(e.message || "Email failed");
    }
  }

  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Rolodex</h1>
          <p className="text-sm text-muted-foreground">View, edit, and email your contacts saved through n8n.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="grid gap-1">
            <Label htmlFor="userId">User ID</Label>
            <Input id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="user_external_id" className="w-60" />
          </div>
          <Button onClick={loadContacts} disabled={!canLoad || loading}>{loading ? "Loading..." : "Refresh"}</Button>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Create contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1"><Label>Full name</Label><Input value={createForm.full_name ?? ""} onChange={(e) => setCreateForm(v => ({ ...v, full_name: e.target.value }))} /></div>
              <div className="grid gap-1"><Label>Email</Label><Input type="email" value={createForm.email ?? ""} onChange={(e) => setCreateForm(v => ({ ...v, email: e.target.value }))} /></div>
              <div className="grid gap-1"><Label>Title</Label><Input value={createForm.title ?? ""} onChange={(e) => setCreateForm(v => ({ ...v, title: e.target.value }))} /></div>
              <div className="grid gap-1"><Label>Company</Label><Input value={createForm.company ?? ""} onChange={(e) => setCreateForm(v => ({ ...v, company: e.target.value }))} /></div>
              <div className="grid gap-1"><Label>Location</Label><Input value={createForm.location ?? ""} onChange={(e) => setCreateForm(v => ({ ...v, location: e.target.value }))} /></div>
              <div className="grid gap-1"><Label>Profile URL</Label><Input value={createForm.profile_url ?? ""} onChange={(e) => setCreateForm(v => ({ ...v, profile_url: e.target.value }))} /></div>
              <div className="grid gap-1 col-span-2"><Label>Profile ID</Label><Input value={createForm.profile_id ?? ""} onChange={(e) => setCreateForm(v => ({ ...v, profile_id: e.target.value }))} /></div>
            </div>
            <Button onClick={createContact} disabled={creating}>{creating ? "Creating..." : "Create"}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Use the mail icon per contact to prefill email with their address.</p>
            {selected && (
              <EmailDialog
                open={emailOpen}
                onOpenChange={setEmailOpen}
                defaultTo={selected.email || ""}
                onSend={async (s, m) => {
                  await sendEmail(selected.id, s, m);
                  setEmailOpen(false);
                }}
              />
            )}
            {!selected && <p className="text-sm text-muted-foreground">Select a contact below to email.</p>}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3">Company</th>
                  <th className="py-2 pr-3">Location</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Profile</th>
                  <th className="py-2 pr-3 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">{loading ? "Loading..." : "No contacts yet"}</td>
                  </tr>
                )}
                {contacts.map((c) => (
                  <EditableRow key={c.id} contact={c} onSave={updateContact} onEmail={() => { setSelected(c); setEmailOpen(true); }} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EditableRow({ contact, onSave, onEmail }: { contact: Contact; onSave: (c: Contact) => void; onEmail: () => void }) {
  const [draft, setDraft] = useState<Contact>(contact);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(contact), [contact.id]);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-b hover:bg-muted/30">
      <td className="py-2 pr-3 min-w-44">{draft.full_name}</td>
      <td className="py-2 pr-3"><Input value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></td>
      <td className="py-2 pr-3"><Input value={draft.company ?? ""} onChange={(e) => setDraft({ ...draft, company: e.target.value })} /></td>
      <td className="py-2 pr-3"><Input value={draft.location ?? ""} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></td>
      <td className="py-2 pr-3"><Input type="email" value={draft.email ?? ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></td>
      <td className="py-2 pr-3 truncate max-w-48">
        {draft.profile_url ? (
          <a href={draft.profile_url} target="_blank" rel="noreferrer" className="underline underline-offset-2">link</a>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="py-2 pr-3">
        <div className="flex gap-2">
          <Button onClick={onEmail}>Mail</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </td>
    </tr>
  );
}

function EmailDialog({ open, onOpenChange, defaultTo, onSend }: { open: boolean; onOpenChange: (v: boolean) => void; defaultTo: string; onSend: (subject: string, message: string) => void; }) {
  const [to] = useState<string>(defaultTo);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <span />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send email</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-1">
            <Label>To</Label>
            <Input value={to} disabled />
          </div>
          <div className="grid gap-1">
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <Label>Message</Label>
            <Textarea rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onSend(subject, message)} disabled={!subject.trim() && !message.trim()}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
