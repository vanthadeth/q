// Muggo 3D poses: optimized, transparent WebP. Static requires so Metro bundles them.
// Regenerate from the supplied PNGs with scripts/build-mascot3d.py.
export const MUGGO_3D = {
  hello: require('./hello.webp'),
  orderAhead: require('./order-ahead.webp'),
  fast: require('./fast.webp'),
  pleaseWait: require('./please-wait.webp'),
  brewing: require('./brewing.webp'),
  ready: require('./ready.webp'),
  thankYou: require('./thank-you.webp'),
  sorry: require('./sorry.webp'),
  connectionLost: require('./connection-lost.webp'),
  specialOffer: require('./special-offer.webp'),
  saving: require('./saving.webp'),
  myLuckyDay: require('./my-lucky-day.webp'),
} as const;

export type MuggoPose = keyof typeof MUGGO_3D;
