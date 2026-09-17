import { Card, PageHeader, Saved } from "@/components/admin/page-header";
import { Field, SubmitButton, TextArea } from "@/components/admin/ui";
import { changePassword, saveSettings } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/site";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [user, settings, { saved, error }] = await Promise.all([
    requireAdmin(),
    getSettings(),
    searchParams,
  ]);

  return (
    <div>
      <PageHeader title="Settings" description="Site name, footer, contact details and social links." />
      <Saved show={saved === "1"} message="Settings saved." />
      <Saved show={saved === "password"} message="Password changed." />

      {error && (
        <p className="mb-6 rounded-md bg-[#f6e3dd] px-4 py-3 text-[15px] text-[#7a2a16]">
          {error === "short"
            ? "The new password must be at least 8 characters."
            : "Your current password was not correct."}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr] xl:items-start">
        <form action={saveSettings} className="flex flex-col gap-6">
          <Card>
            <h2 className="pb-5 font-display text-xl font-semibold text-ink">Identity</h2>
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Site name" name="siteName" defaultValue={settings.siteName} required />
                <Field label="Tagline" name="tagline" defaultValue={settings.tagline} />
              </div>
              <TextArea
                label="Footer paragraph"
                name="footerAbout"
                rows={4}
                defaultValue={settings.footerAbout}
              />
              <Field label="Footer quote" name="footerQuote" defaultValue={settings.footerQuote} />
            </div>
          </Card>

          <Card>
            <h2 className="pb-5 font-display text-xl font-semibold text-ink">Contact</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Email" name="contactEmail" defaultValue={settings.contactEmail} />
              <Field label="Phone" name="contactPhone" defaultValue={settings.contactPhone} />
              <Field label="Address" name="contactAddress" defaultValue={settings.contactAddress} />
            </div>
          </Card>

          <Card>
            <h2 className="pb-5 font-display text-xl font-semibold text-ink">Social links</h2>
            <p className="pb-4 text-[14px] text-muted">Leave a field empty to hide that icon.</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="YouTube" name="youtube" defaultValue={settings.youtube} />
              <Field label="Instagram" name="instagram" defaultValue={settings.instagram} />
              <Field label="Facebook" name="facebook" defaultValue={settings.facebook} />
              <Field label="X" name="twitter" defaultValue={settings.twitter} />
              <Field label="LinkedIn" name="linkedin" defaultValue={settings.linkedin} />
            </div>
          </Card>

          <div>
            <SubmitButton>Save settings</SubmitButton>
          </div>
        </form>

        <Card>
          <h2 className="font-display text-xl font-semibold text-ink">Your account</h2>
          <p className="pt-2 pb-5 text-[15px] text-muted">
            Signed in as {user.name} ({user.email}).
          </p>

          <form action={changePassword} className="flex flex-col gap-4">
            <Field label="Current password" name="currentPassword" type="password" required />
            <Field
              label="New password"
              name="newPassword"
              type="password"
              required
              hint="At least 8 characters."
            />
            <SubmitButton>Change password</SubmitButton>
          </form>
        </Card>
      </div>
    </div>
  );
}
