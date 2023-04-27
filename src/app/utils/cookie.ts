export function getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    let cookieValue = '';
    for (let i = 0; i < caLen; i++) {
        c = ca[i].replace(/^\s+/g, '');
        if (c.indexOf(cookieName) === 0) {
            cookieValue = c.substring(cookieName.length, c.length);
        }
    }
    return cookieValue.replace('%20', ' ');
}

export function deleteCookie(name: string, domain?: string) {
    setCookie(name, '', -1, '/', domain);
}

export function setCookie(
    name: string,
    value: string,
    expireDays: number,
    path: string = '',
    domain: string = '',
) {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    let cdomain: string = `; domain=${domain}`;

    document.cookie = `${name}=${value}; ${expires}${cpath}${cdomain}`;
}
