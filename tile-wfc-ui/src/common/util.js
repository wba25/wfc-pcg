export function getObjValues(obj) {
    return Object.keys(obj).map(function(key) {
        return obj[key];
    });
}


export async function readFileAsDataURL(files) {
    if (files && files.length > 0) {
        let result_base64 = await new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = (e) => resolve(fileReader.result);
            fileReader.readAsDataURL(files[0]);
        });
        return result_base64;
    }
    return null;
}