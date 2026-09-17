import { Card, PageHeader, Saved } from "@/components/admin/page-header";
import { ImageField } from "@/components/admin/image-field";
import { Field, SubmitButton, TextArea, Toggle } from "@/components/admin/ui";
import { saveHomePage } from "@/app/admin/actions";
import { getHomePage } from "@/lib/site";

export default async function HomepageAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [home, { saved }] = await Promise.all([getHomePage(), searchParams]);

  return (
    <div>
      <PageHeader
        title="Homepage content"
        description="Every block on the homepage, in the order it appears."
      />
      <Saved show={Boolean(saved)} message="Homepage updated." />

      <form action={saveHomePage} className="flex flex-col gap-6">
        <Card>
          <h2 className="pb-5 font-display text-xl font-semibold text-ink">Hero</h2>
          <div className="flex flex-col gap-5">
            <Field label="Eyebrow" name="heroEyebrow" defaultValue={home.heroEyebrow} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Headline, line 1" name="heroTitleLine1" defaultValue={home.heroTitleLine1} />
              <Field label="Headline, line 2" name="heroTitleLine2" defaultValue={home.heroTitleLine2} />
            </div>
            <TextArea label="Subtitle" name="heroSubtitle" rows={3} defaultValue={home.heroSubtitle} />
            <ImageField
              label="Hero image"
              name="heroImage"
              defaultValue={home.heroImage}
              hint="Wide image, at least 1600px across. A photograph of a ghat, temple or manuscript works well."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Button label" name="heroCtaLabel" defaultValue={home.heroCtaLabel} />
              <Field label="Button link" name="heroCtaHref" defaultValue={home.heroCtaHref} />
            </div>
            <Field label="Note under the button" name="heroNote" defaultValue={home.heroNote} />
            <Field label="Pull quote" name="heroQuote" defaultValue={home.heroQuote} />
          </div>
        </Card>

        <Card>
          <h2 className="pb-5 font-display text-xl font-semibold text-ink">Featured books section</h2>
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Eyebrow" name="featuredEyebrow" defaultValue={home.featuredEyebrow} />
              <Field label="Heading" name="featuredTitle" defaultValue={home.featuredTitle} />
            </div>
            <Field label="Sub-line" name="featuredSubtitle" defaultValue={home.featuredSubtitle} />
            <p className="text-[14px] text-muted">
              Which books appear here is set per book — tick “Featured on the homepage” on any book.
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="pb-5 font-display text-xl font-semibold text-ink">Verse of the day</h2>
          <Toggle
            label="Show the verse band on the homepage"
            name="verseEnabled"
            defaultChecked={home.verseEnabled}
            hint="The verse itself is chosen under “Verse of the day”."
          />
        </Card>

        <Card>
          <h2 className="pb-5 font-display text-xl font-semibold text-ink">About section</h2>
          <div className="flex flex-col gap-5">
            <Field label="Heading" name="aboutTitle" defaultValue={home.aboutTitle} />
            <TextArea
              label="Body"
              name="aboutBody"
              rows={8}
              defaultValue={home.aboutBody}
              hint="Also used at the top of the About page."
            />
            <ImageField label="About image" name="aboutImage" defaultValue={home.aboutImage} />
          </div>
        </Card>

        <div>
          <SubmitButton>Save homepage</SubmitButton>
        </div>
      </form>
    </div>
  );
}
