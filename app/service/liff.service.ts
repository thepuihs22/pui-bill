import liff from '@line/liff';

export const liffDefaultId = process.env.NEXT_PUBLIC_LIFF_ID as string;


export async function initLiff(liffId: string = liffDefaultId) {
    
    if (!liffId) {
        throw new Error('liffId is required for LIFF initialization');
    }    
    await liff.init({ liffId });
}

export function isLoggedIn() {
    return liff.isLoggedIn();
}

export function login(redirectUri?: string) {
    liff.login(redirectUri ? { redirectUri } : undefined);
}

export async function getProfile() {
    if (!liff.isLoggedIn()) return null;
    try {
        return await liff.getProfile();
    } catch (e) {
        return null;
    }
}
