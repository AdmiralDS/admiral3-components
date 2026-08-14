import { animation } from '@admiral-ds/admiral3-tokens';

const duration = animation.motion.duration;
const easing = animation.motion.easing;

export const durationInstant = `var(--admiral-animation-motion-duration-instant, ${duration.instant}ms)`;
export const durationShort1 = `var(--admiral-animation-motion-duration-short-1, ${duration.short_1}ms)`;
export const durationShort2 = `var(--admiral-animation-motion-duration-short-2, ${duration.short_2}ms)`;
export const durationShort3 = `var(--admiral-animation-motion-duration-short-3, ${duration.short_3}ms)`;
export const durationShort4 = `var(--admiral-animation-motion-duration-short-4, ${duration.short_4}ms)`;
export const durationMedium1 = `var(--admiral-animation-motion-duration-medium-1, ${duration.medium_1}ms)`;
export const durationMedium2 = `var(--admiral-animation-motion-duration-medium-2, ${duration.medium_2}ms)`;
export const durationMedium3 = `var(--admiral-animation-motion-duration-medium-3, ${duration.medium_3}ms)`;
export const durationMedium4 = `var(--admiral-animation-motion-duration-medium-4, ${duration.medium_4}ms)`;
export const durationLong1 = `var(--admiral-animation-motion-duration-long-1, ${duration.long_1}ms)`;
export const durationLong2 = `var(--admiral-animation-motion-duration-long-2, ${duration.long_2}ms)`;
export const durationLong3 = `var(--admiral-animation-motion-duration-long-3, ${duration.long_3}ms)`;
export const durationLong4 = `var(--admiral-animation-motion-duration-long-4, ${duration.long_4}ms)`;

export const easingLinear = `var(--admiral-animation-motion-easing-linear, ${easing.linear})`;
export const easingDecelerateStandard = `var(--admiral-animation-motion-easing-decelerate-standard, ${easing.decelerate.standard})`;
export const easingDecelerateEmphasized = `var(--admiral-animation-motion-easing-decelerate-emphasized, ${easing.decelerate.emphasized})`;
export const easingAccelerateStandard = `var(--admiral-animation-motion-easing-accelerate-standard, ${easing.accelerate.standard})`;
export const easingAccelerateEmphasized = `var(--admiral-animation-motion-easing-accelerate-emphasized, ${easing.accelerate.emphasized})`;

export const hoverPressLeaveTransition = `${durationShort2} ${easingLinear}`;
