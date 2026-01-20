export function sendPostRequest(
    url: string,
    data: any = null,
    type: string
): Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        // AUTH
        xhr.withCredentials = true; // 🔥 REQUIRED 4 Cookies

        xhr.setRequestHeader("Content-Type", type);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e: any) {
                        reject(new Error("Failed to parse JSON response: " + e.message));
                    }
                } else {
                    reject(
                        new Error(
                            `HTTP error! status: ${xhr.status}, statusText: ${xhr.statusText}`
                        )
                    );
                }
            }
        };
        if (data) {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    });
}

export function sendGetRequest(
	url: string,
	token?: string //questo va cancellato :)
): Promise<any> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);


        // AUTH
        xhr.withCredentials = true;
		xhr.setRequestHeader("Authorization", `Bearer ${token}`);   // deprecated
		
        
        xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					try {
						const response = JSON.parse(xhr.responseText);
						resolve(response);
					} catch (e: any) {
						reject(new Error("Failed to parse JSON response: " + e.message));
					}
				} else {
					reject(
						new Error(
							`HTTP error! status: ${xhr.status}, statusText: ${xhr.statusText}`
						)
					);
				}
			}
		};
		xhr.send();
	});
}
