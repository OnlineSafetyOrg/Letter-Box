const userCooldowns = new Map<string, number>();
const cooldownTime = 10 * 1000; // 6 * 60 * 60 * 1000; // 6 timer

export function isOnCooldown(userId: string): boolean {
    const lastUsed = userCooldowns.get(userId);
    if (!lastUsed) return false;
    return Date.now() - lastUsed < cooldownTime;
}

export function setCooldown(userId: string) {
    userCooldowns.set(userId, Date.now());
}
