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
    // liff.login(redirectUri ? { redirectUri } : undefined);
    console.log('login', window.location.href);
    liff.login({ redirectUri: window.location.href });
}

export async function getProfile() {
    if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
    }
    try {
        return await liff.getProfile();
    } catch (e) {
        return null;
    }
}
