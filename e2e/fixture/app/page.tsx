// NOTE: no "use client" here, deliberately.
//
// This page is a Server Component importing the package from its root barrel.
// That is the point of the fixture: this package ships hook-using components
// (useContext, useEffect, useSyncExternalStore), so its built output must
// carry a "use client" directive of its own. It did not, for its entire
// published life -- tsup silently dropped the esbuild banner under
// `treeshake: true` -- and no unit test could see it.
import {
  ConsentBanner,
  ConsentBannerAcceptButton,
  ConsentBannerActions,
  ConsentBannerContent,
  ConsentBannerDismissButton,
  ConsentBannerLink,
} from "@silverassist/consent-banner";

export default function Page() {
  return (
    <main>
      <h1>consent-banner fixture</h1>
      <ConsentBanner storageKey="e2e-consent">
        <ConsentBannerContent>
          We use cookies.{" "}
          <ConsentBannerLink href="/privacy">Learn more</ConsentBannerLink>
        </ConsentBannerContent>
        <ConsentBannerActions>
          <ConsentBannerAcceptButton>Accept</ConsentBannerAcceptButton>
          <ConsentBannerDismissButton>Dismiss</ConsentBannerDismissButton>
        </ConsentBannerActions>
      </ConsentBanner>
    </main>
  );
}
