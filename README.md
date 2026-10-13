# Brew Pass

Coffee chain app for iOS, Android and web (one Expo / React Native codebase).
Working name, not final. Phase 1 scope is in the approved plan.

## Run

```bash
npm install
cp .env.example .env.local   # fill in Supabase URL and anon key
npm run web                  # or: npm run ios / npm run android
npm test                     # pure logic: points, order states
npm run typecheck
npm run build:web            # static web build into dist/
```

Without Supabase keys the app still opens. Sign-in, checkout and the staff queue show a "not connected" message.

## Layout

- `app/` screens (Expo Router). `(tabs)/` is Home, Order, Deals. `menu.tsx` is the drawer. `auth/` is sign-in. `checkout.tsx` is KHQR. `staff.tsx` is the store queue (web).
- `lib/` theme tokens, cart, points rule, pickup slots, order states, Supabase client, sample menu.
- `supabase/migrations/0001_init.sql` schema and row-level security.

## Status

Built:
- App shell, theme tokens from the approved proposal (light and dark)
- Home, Order (pickup slots, cart), Deals, menu drawer
- Sign-in screen (phone code by SMS / Telegram / WhatsApp, Google) and code entry
- Checkout that creates a `pending_payment` order and asks for a KHQR
- Staff queue with live updates
- Points rule as configuration (placeholder until the business sets it)
- Schema and RLS

Not built yet (see the plan):
- `supabase/functions/`: `send-otp`, `verify-otp`, `khqr-create`, `khqr-webhook`, `notify-order`. These need Telegram, WhatsApp, SMS and Bakong credentials.
- Account linking, "Try another way" recovery, and account merge.
- Staff role. The staff queue currently needs a staff login and a policy that lets staff read and update orders.
- Points ledger writes (on payment) and the points history screen.
- Push notifications (Expo Push).
- Real menu and promotions, read from the database. Menu, deals and points on Home are examples, marked in code.
- Tab icons (tabs use default placeholders).

## Notes

- Prices are in riel (KHR).
- Points are not yet awarded. The earn rule in `lib/points.ts` and `earn_rule` is a placeholder until the business sets it.
