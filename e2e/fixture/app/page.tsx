// NOTE: no "use client" here, deliberately.
//
// This page is a Server Component importing the package from its root barrel.
// That is the point of the fixture: this package ships hook-using components
// (useContext, useEffect, useSyncExternalStore), so its built output must
// carry a "use client" directive of its own. It did not, for its entire
// published life -- tsup silently dropped the esbuild banner under
// `treeshake: true` -- and no unit test could see it.
import { ConsentBanner } from "@silverassist/consent-banner";

export default function Page() {
  return (
    <main>
      <h1>consent-banner fixture</h1>
      <ConsentBanner storageKey="e2e-consent">
        <ConsentBanner.Content>
          We use cookies.{" "}
          <ConsentBanner.Link href="/privacy">Learn more</ConsentBanner.Link>
        </ConsentBanner.Content>
        <ConsentBanner.Actions>
          <ConsentBanner.AcceptButton>Accept</ConsentBanner.AcceptButton>
          <ConsentBanner.DismissButton>Dismiss</ConsentBanner.DismissButton>
        </ConsentBanner.Actions>
      </ConsentBanner>
    </main>
  );
}
