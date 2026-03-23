import HomeClient from './HomeClient';

export { photoboomMetadata } from './HomeClient';

/** Server shell only — no `searchParams`/`params` props so nothing async-dynamic ends up on the client tree (DevTools-safe). */
export default function Page() {
  return <HomeClient />;
}
