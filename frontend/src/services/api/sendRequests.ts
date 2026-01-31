
export class HttpError extends Error {
  status: number;
  statusText?: string;

  constructor(status: number, statusText?: string) {
    super(`HTTP error! status: ${status}${statusText ? `, ${statusText}` : ''}`);
    this.status = status;
    this.statusText = statusText;
  }
}

export function sendPostRequest(
    url: string,
    data: any = null,
    type: string = 'application/json'
): Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        // AUTH
        xhr.withCredentials = true; // 🔥 REQUIRED 4 Cookies

        // set type
        xhr.setRequestHeader("Content-Type", type);

        // Onload safer because fires only once
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = xhr.responseText
                        ? JSON.parse(xhr.responseText)
                        : null;
                    resolve(response);
                } catch (e: any) {
                    reject(new Error("Failed to parse JSON response: " + e.message));
                }
            } else {
                reject(new HttpError(xhr.status, xhr.statusText));
            }
        };

        xhr.onerror = () => {
            reject(new HttpError(0, 'Network error'));
        };

        if (data) {
            xhr.send(
                type === 'application/json'
                    ? JSON.stringify(data)
                    : data
            );
        } else {
            xhr.send();
        }
    });
}

export function sendGetRequest(
	url: string,
): Promise<any> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);

        // AUTH
        xhr.withCredentials = true; // 🔥 REQUIRED 4 Cookies

        // Onload safer because fires only once
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = xhr.responseText
                        ? JSON.parse(xhr.responseText)
                        : null;
                    resolve(response);
                } catch (e: any) {
                    reject(new Error("Failed to parse JSON response: " + e.message));
                }
            } else {
                reject(new HttpError(xhr.status, xhr.statusText));
            }
        };

        xhr.onerror = () => {
            reject(new HttpError(0, 'Network error'));
        };

        xhr.send();
    });
}

export function sendDeleteRequest(
    url: string,
): Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("DELETE", url, true);

        // AUTH
        xhr.withCredentials = true; // 🔥 REQUIRED 4 Cookies

        // Onload safer because fires only once
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = xhr.responseText
                        ? JSON.parse(xhr.responseText)
                        : null;
                    resolve(response);
                } catch (e: any) {
                    reject(new Error("Failed to parse JSON response: " + e.message));
                }
            } else {
                reject(new HttpError(xhr.status, xhr.statusText));
            }
        };

        xhr.onerror = () => {
            reject(new HttpError(0, 'Network error'));
        };

        xhr.send();
    });
}

export function sendPatchRequest(
    url: string,
    data: any = null,
    type: string = "application/json"
): Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PATCH", url, true);

        // AUTH
        xhr.withCredentials = true; // 🔥 REQUIRED 4 Cookies

        // set type
        xhr.setRequestHeader("Content-Type", type);

        // Onload safer because fires only once
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = xhr.responseText
                        ? JSON.parse(xhr.responseText)
                        : null;
                    resolve(response);
                } catch (e: any) {
                    reject(new Error("Failed to parse JSON response: " + e.message));
                }
            } else {
                reject(new HttpError(xhr.status, xhr.statusText));
            }
        };

        xhr.onerror = () => {
            reject(new HttpError(0, 'Network error'));
        };

        if (data) {
            xhr.send(
                type === 'application/json'
                    ? JSON.stringify(data)
                    : data
            );
        } else {
            xhr.send();
        }
    });
}